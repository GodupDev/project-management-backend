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

      // Validate & parse pagination and sort
      const parsedPage = Math.max(parseInt(page), 1);
      const parsedLimit = Math.max(parseInt(limit), 1);
      const sortOrder = sort === "asc" ? 1 : -1;

      // Step 1: Find project IDs where the user is a member
      const memberships = await ProjectMemberModel.find({ userId }).select(
        "projectId",
      );
      
      const projectIds = memberships.map((member) => member.projectId);

      // Step 2: Build dynamic query
      const query = { _id: { $in: projectIds } };

      if (status) {
        query.status = status;
      }

      if (from || to) {
        query["dateRange.startDate"] = {};
        if (from) query["dateRange.startDate"].$gte = new Date(from);
        if (to) query["dateRange.startDate"].$lte = new Date(to);
      }

      // Add search keyword if provided
      if (search) {
        const regex = new RegExp(search, "i");
        query.$or = [{ name: regex }, { description: regex }];
      }

      // Step 3: Execute query with pagination and sorting
      const [projects, total] = await Promise.all([
        ProjectModel.find(query)
          .sort({ createdAt: sortOrder })
          .skip((parsedPage - 1) * parsedLimit)
          .limit(parsedLimit)
          .populate("createdBy", "username email"),
        ProjectModel.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        total,
        page: parsedPage,
        limit: parsedLimit,
        data: projects,
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
      const project = await ProjectModel.findById(req.params.id).populate(
        "createdBy",
        "username email",
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const rawMembers = await ProjectMemberModel.find({
        projectId: project._id,
      })
        .populate("userId", "_id") // Chỉ lấy _id
        .populate("roleId", "name"); // Chỉ lấy name

      // Làm gọn dữ liệu member
      const members = rawMembers.map((member) => ({
        userId: member.userId?._id,
        role: member.roleId?.name,
      }));

      return res.status(200).json({
        success: true,
        data: {
          ...project.toObject(),
          members,
        },
      });
    } catch (error) {
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

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `updated project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_UPDATED, // Hoặc loại thông báo
      };

      await createNotification(reqNotification);

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

  // Thêm member vào project (chỉ creator hoặc leader mới thêm được)

  addProjectMembers: async (req, res) => {
    try {
      const members = req.body.members; // [{ userId }]
      const projectId = req.params.id;

      if (!Array.isArray(members) || members.length === 0) {
        return res.status(400).json({
          success: false,
          message: "User list is required",
        });
      }

      const project = await ProjectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const usernames = [];
      const addedMembers = [];

      for (const { userId } of members) {
        const exists = await ProjectMemberModel.findOne({ projectId, userId });
        if (!exists) {
          const member = await ProjectMemberModel.create({ projectId, userId });

          const populatedMember = await member.populate({
            path: "userId",
            select: "userName", // chỉ lấy userName
          });

          const username = populatedMember.userId.toJSON().userName;
          usernames.push(username);

          const cleanMember = member.toObject();
          delete cleanMember.__v;
          delete cleanMember.createdAt;
          delete cleanMember.updatedAt;
          delete cleanMember.projectId;

          addedMembers.push(cleanMember);
        }
      }

      if (addedMembers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No new members added",
        });
      }

      const content = usernames.join(", ");

      // Gửi thông báo cho creator
      const verbToBe = addedMembers.length > 1 ? "are" : "is";
      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `${content} ${verbToBe} added to project: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_MEMBER_ADDED, // Hoặc loại thông báo
      };

      await createNotification(reqNotification);

      return res.status(201).json({
        success: true,
        message: "Members added successfully",
        data: addedMembers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to add members",
        error: error.message,
      });
    }
  },

  // Lấy danh sách member của project
  getProjectMembers: async (req, res) => {
    try {
      const project = await ProjectModel.findById(req.params.id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      const members = await ProjectMemberModel.find({
        projectId: req.params.id,
      })
        .populate("userId", "username email")
        .populate("roleId", "name");

      return res.status(200).json({
        success: true,
        data: members,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to get members",
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

      console.log(username, roleName);

      const reqNotification = {
        authorId: req.user._id,
        projectId: project._id,
        content: `${username} is updated role to ${roleName}: ${project.projectName}`,
        Types: Enum.NOTIFICATION_TYPES.PROJECT_MEMBER_UPDATED, // Hoặc loại thông báo
      };

      console.log(reqNotification);

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
