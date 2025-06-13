import Enum from "../config/enums.config.js";
import Collection from "../config/collection.config.js";

import ProjectModel from "../models/main/project.model.js";
import ProjectMemberModel from "../models/main/projectMember.model.js";
import UserModel from "../models/main/users.model.js";

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
        roleId: "684af97fba312846eace5d55", // Staff role
      });

      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create project",
        error: error.message,
      });
    }
  },

  getAllProjectsUnfiltered: async (req, res) => {
  try {
    const {
      sort = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const parsedPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.max(parseInt(limit), 1);
    const sortOrder = sort === "asc" ? 1 : -1;

    const [projects, total] = await Promise.all([
      ProjectModel.find({})
        .sort({ createdAt: sortOrder })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit)
        .lean(),
      ProjectModel.countDocuments({}),
    ]);

    return res.status(200).json({
      success: true,
      message: "All projects (unfiltered) retrieved successfully",
      total,
      page: parsedPage,
      limit: parsedLimit,
      data: projects,
    });
  } catch (error) {
    console.error("Error in getAllProjectsUnfiltered:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all projects",
      error: error.message,
    });
  }
},
  // Lấy tất cả project
  // + Từ tất cả project mà user đang làm việc
  // + Thêm các filler (status, Data range), sort
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

      // Validate dates
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

      // Get projects the user is a member of
      const memberships = await ProjectMemberModel.find({ userId }).select(
        "projectId",
      );
      const memberProjectIds = memberships.map((m) => m.projectId);

      // Build query
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

      // Get paginated projects and total count
      const [projects, total] = await Promise.all([
        ProjectModel.find(query)
          .sort({ createdAt: sortOrder })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit),
        ProjectModel.countDocuments(query),
      ]);

      const projectIds = projects.map((project) => project._id);

      // Count members per project
      const membersGrouped = await ProjectMemberModel.aggregate([
        { $match: { projectId: { $in: projectIds } } },
        {
          $group: {
            _id: "$projectId",
            count: { $sum: 1 },
          },
        },
      ]);

      const memberCountMap = {};
      membersGrouped.forEach((item) => {
        memberCountMap[item._id.toString()] = item.count;
      });

      const result = projects.map((project) => ({
        ...project.toObject(),
        memberCount: memberCountMap[project._id.toString()] || 0,
      }));

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

  getProjectMembers: async (req, res) => {
    const { projectId } = req.params;

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

      const updatedProject = await ProjectModel.findByIdAndUpdateProject(
        req.params.id,
        req.body,
      );

      var log = "";

      for (const userId of req.body.memberIds) {
        const member = await UserModel.findById(userId);

        if (member) {
          await ProjectMemberModel.create({
            projectId: project._id,
            userId,
          });
        } else {
          log += `User with ID ${userId} not found. `;
        }
      }

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `updated project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_UPDATED, // Hoặc loại thông báo
      };

      await createNotification(reqNotification);

      return res.status(200).json({
        log,
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

      const populatedMember = await member.populate({
        path: "userId",
        select: "userName", // hoặc "username" tùy theo schema
      });

      const username = populatedMember.userId.toJSON().userName;

      await member.deleteOne();

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `${username} is deleted from project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_MEMBER_REMOVED, // Hoặc loại thông báo
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

  updateProjectMember: async (req, res) => {
    try {
      const projectId = req.params.id;
      const memberId = req.params.memberId; // userId của member
      const { roleId } = req.body; // ví dụ muốn cập nhật roleId

      // Kiểm tra project tồn tại
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Tìm member trong project
      const member = await ProjectMemberModel.findOne({
        projectId,
        userId: memberId,
      });

      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      if (roleId) {
        member.roleId = roleId;
      }

      await member.save();

      const populatedMember = await member.populate([
        {
          path: "userId",
          select: "userName", // hoặc "username" tùy theo schema
        },
        {
          path: "roleId",
          select: "name",
        },
      ]);

      const username = populatedMember.userId.toJSON().userName;
      const roleName = populatedMember.roleId.toJSON().name;

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `${username} is updated role to ${roleName}: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_MEMBER_UPDATED, // Hoặc loại thông báo
      };

      await createNotification(reqNotification);

      return res.status(200).json({
        success: true,
        message: "Member updated successfully",
        data: member,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update member",
        error: error.message,
      });
    }
  },
};

export default ProjectController;