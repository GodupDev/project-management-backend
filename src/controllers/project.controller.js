import Enum from "../config/enums.config.js";

import ProjectModel from "../models/main/project.model.js";
import ProjectMemberModel from "../models/main/projectMember.model.js";

import createNotification from "../services/notification.service.js";

import { validationResult } from "express-validator";

const ProjectController = {
  // Tạo project mới
  createProject: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user._id;
      const { projectName, description, startDate, endDate } = req.body;

      if (!projectName) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: projectName",
        });
      }

      // Tạo project
      const project = await ProjectModel.create({
        projectName,
        description,
        startDate: startDate || new Date(),
        endDate,
        createdBy: userId,
      });

      // Tạo member mặc định: creator làm leader
      await ProjectMemberModel.create({
        projectId: project._id,
        userId,
        roleId: "684ced387f9d39d5d4d0e8d8", // Staff role
      });

      // Chuyển thành plain object
      const projectObj = project.toObject();

      // Gắn memberCount thủ công
      projectObj.memberCount = 1;

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: projectObj,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create project",
        error: error.message,
      });
    }
  },

  // Lấy tất cả project
  // + Từ tất cả project mà user đang làm việc
  // + Thêm các filler (status, Data range), sort
  // Lấy tất cả project mà user hiện tại là thành viên
  getAllProjects: async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        status,
        from,
        to,
        sort = "desc",
        page = 1,
        limit = 10,
        search,
      } = req.query;

      const parsedPage = Math.max(parseInt(page), 1);
      const parsedLimit = Math.max(parseInt(limit), 1);
      const sortOrder = sort === "asc" ? 1 : -1;

      // Validate date range
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid date format. Please use ISO format (YYYY-MM-DD)",
          });
        }
        if (fromDate > toDate) {
          return res.status(400).json({
            success: false,
            message: "From date cannot be after to date",
          });
        }
      }

      // Lấy danh sách projectId từ các project mà user là thành viên
      const memberships = await ProjectMemberModel.find({ userId }).select(
        "projectId",
      );
      const memberProjectIds = memberships.map((m) => m.projectId);

      // Tạo query lọc
      const query = { _id: { $in: memberProjectIds } };
      if (status) query.status = status;
      if (from || to) {
        query["dateRange.startDate"] = {};
        if (from) query["dateRange.startDate"].$gte = new Date(from);
        if (to) query["dateRange.startDate"].$lte = new Date(to);
      }
      if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [{ projectName: regex }, { description: regex }];
      }

      // Lấy project theo phân trang + tổng số project
      const [projects, total] = await Promise.all([
        ProjectModel.find(query)
          .sort({ createdAt: sortOrder })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        ProjectModel.countDocuments(query),
      ]);

      const projectIds = projects.map((project) => project._id);

      // Lấy thông tin thành viên từng project và populate userId (lấy name)
      const allMembers = await ProjectMemberModel.find({
        projectId: { $in: projectIds },
      }).populate("userId", "_id username"); // Chỉ lấy id và name

      // Gom nhóm member theo từng project
      const membersGroupedMap = {};
      allMembers.forEach(({ projectId, userId }) => {
        const pid = projectId.toString();
        if (!membersGroupedMap[pid]) membersGroupedMap[pid] = [];
        membersGroupedMap[pid].push({
          _id: userId._id,
          name: userId.username,
        });
      });

      // Gắn thông tin member vào từng project
      const result = projects.map((project) => {
        const pid = project._id.toString();
        return {
          ...project.toObject(),
          memberCount: membersGroupedMap[pid]?.length || 0,
          members: membersGroupedMap[pid] || [],
        };
      });

      return res.status(200).json({
        success: true,
        total,
        page: parsedPage,
        limit: parsedLimit,
        data: result,
      });
    } catch (error) {
      console.error("Error in getAllProjects:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving projects.",
        error: error.message,
      });
    }
  },

  // Lấy project theo ID, kèm thành viên
  getProjectById: async (req, res) => {
    try {
      const projectId = req.params.id;

      // Get project with creator details
      const project = await ProjectModel.findById(projectId)
        .populate({
          path: "createdBy",
          select: "username userProfileId",
          populate: {
            path: "userProfileId",
            select: "avatar",
          },
        })
        .lean();

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Get project members with user details
      const members = await ProjectMemberModel.find({ projectId })
        .populate({
          path: "userId",
          select: "username userProfileId",
          populate: {
            path: "userProfileId",
            select: "avatarUrl",
          },
        })
        .populate("roleId", "name")
        .lean();

      // Format response data
      const formattedMembers = members.map((member) => ({
        userId: member.userId._id,
        username: member.userId.username,
        avatarUrl: member.userId.userProfileId?.avatarUrl,
        role: member.roleId?.name,
      }));

      return res.status(200).json({
        success: true,
        data: {
          ...project,
          createdBy: {
            _id: project.createdBy._id,
            username: project.createdBy.username,
            avatar: project.createdBy.userProfileId?.avatar,
          },
          members: formattedMembers,
          statistics: {
            memberCount: members.length,
          },
        },
      });
    } catch (error) {
      console.error("Error in getProjectById:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get project",
        error: error.message,
      });
    }
  },

  // Cập nhật project (chỉ creator hoặc leader mới được update)
  updateProject: async (req, res) => {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // 1. Kiểm tra phải có ít nhất 1 leader
      const hasLeader = req.body.members.some((m) => m.role === "leader");
      if (!hasLeader) {
        return res.status(400).json({
          success: false,
          message: "Project must have at least one leader.",
        });
      }

      // 2. Lấy danh sách thành viên hiện tại
      const currentMembers = await ProjectMemberModel.find({
        projectId: project._id,
      });
      const currentMemberMap = {};
      currentMembers.forEach((m) => {
        currentMemberMap[m.userId.toString()] = m;
      });

      // 3. Duyệt qua từng member trong body
      for (const memberObj of req.body.members) {
        const userId = memberObj.userId;
        const role = memberObj.role || "staff";
        const existMember = currentMemberMap[userId];

        if (existMember) {
          // Nếu đã có, cập nhật role nếu khác
          if (existMember.role !== role) {
            existMember.role = role;
            await existMember.save();
          }
        } else {
          // Nếu chưa có, thêm mới
          await ProjectMemberModel.create({
            projectId: project._id,
            userId,
            role,
          });
        }
      }

      // 4. Cập nhật thông tin project
      const updatedProject = await ProjectModel.findByIdAndUpdateProject(
        req.params.id,
        req.body,
      );

      // Gửi thông báo (nếu cần)
      // ...

      return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update project",
        error: error.message,
      });
    }
  },

  // Xóa project (chỉ creator mới được xóa)
  deleteProject: async (req, res) => {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      await Promise.all([
        ProjectModel.findByIdAndDelete(req.params.id),
        ProjectMemberModel.deleteMany({ projectId: req.params.id }),
      ]);

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `updated project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_DELETED, // Hoặc loại thông báo
      };

      await createNotification(reqNotification);

      return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete project",
        error: error.message,
      });
    }
  },

  getProjectMembers: async (req, res) => {
    const { projectId } = req.params;
    console.log("Fetching members for project:", projectId);
    try {
      const members = await ProjectMemberModel.find({ projectId })
        .populate({
          path: "userId",
          select: "username email userProfileId", // chỉ lấy cần thiết
        })
        .populate({
          path: "roleId",
          select: "name", // nếu muốn lấy tên role
        });

      res.status(200).json({
        success: true,
        data: members,
      });
    } catch (err) {
      console.error("Error fetching project members:", err);
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách thành viên dự án",
      });
    }
  },

  // Xóa member khỏi project (chỉ creator hoặc leader mới được xóa)
  removeProjectMember: async (req, res) => {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const member = await ProjectMemberModel.findOne({
        projectId: req.params.id,
        userId: req.params.memberId,
      });

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      // Đếm số leader hiện tại
      const allMembers = await ProjectMemberModel.find({
        projectId: req.params.id,
      });
      const leaderCount = allMembers.filter((m) => m.role === "leader").length;

      // Nếu member này là leader và là leader cuối cùng thì không cho xóa
      if (member.role === "leader" && leaderCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Project must have at least one leader.",
        });
      }

      const populatedMember = await member.populate({
        path: "userId",
        select: "username",
      });

      const username = populatedMember.userId.username;

      await member.deleteOne();

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `${username} is deleted from project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_MEMBER_REMOVED,
      };

      await createNotification(reqNotification);

      return res.status(200).json({
        success: true,
        message: "Member removed successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to remove member",
        error: error.message,
      });
    }
  },
};

export default ProjectController;
