import ProjectModel from "../models/main/project.model.js";
import ProjectMemberModel from "../models/main/projectMember.model.js";

class ProjectController {
  // Create a new project
  static async createProject(req, res) {
    try {
      const projectData = {
        ...req.body,
        createdBy: req.user._id,
      };
      const project = await ProjectModel.create(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all projects
  static async getAllProjects(req, res) {
    try {
      const projects = await ProjectModel.find()
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get project by ID
  static async getProjectById(req, res) {
    try {
      const project = await ProjectModel.findById(req.params.id).populate(
        "createdBy",
        "username email",
      );
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update project
  static async updateProject(req, res) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true },
      );
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete project
  static async deleteProject(req, res) {
    try {
      const project = await ProjectModel.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      // Also delete all project members
      await ProjectMemberModel.deleteMany({ projectId: req.params.id });
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Add project member
  static async addProjectMember(req, res) {
    try {
      const { userId, roleId } = req.body;
      const projectId = req.params.id;

      // Check if project exists
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if member already exists
      const existingMember = await ProjectMemberModel.findOne({
        projectId,
        userId,
      });
      if (existingMember) {
        return res
          .status(400)
          .json({ message: "User is already a member of this project" });
      }

      const member = await ProjectMemberModel.create({
        projectId,
        userId,
        roleId,
      });
      res.status(201).json(member);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get project members
  static async getProjectMembers(req, res) {
    try {
      const members = await ProjectMemberModel.find({
        projectId: req.params.id,
      })
        .populate("userId", "username email")
        .populate("roleId", "name");
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Remove project member
  static async removeProjectMember(req, res) {
    try {
      const member = await ProjectMemberModel.findOneAndDelete({
        projectId: req.params.id,
        _id: req.params.memberId,
      });
      if (!member) {
        return res.status(404).json({ message: "Project member not found" });
      }
      res.json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default ProjectController;
