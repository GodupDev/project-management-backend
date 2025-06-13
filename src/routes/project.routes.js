import express from "express";
import ProjectController from "../controllers/project.controller.js";
import { protect, checkRoleAndPermission } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Project routes
router.post("/", protect, ProjectController.createProject);

router.get("/all-unfiltered", ProjectController.getAllProjectsUnfiltered);

router.get("/:projectId/members",  ProjectController.getProjectMembers);

router.get("/", protect, ProjectController.getAllProjects);

router.get("/:id", protect, ProjectController.getProjectById);

router.put("/:id", protect, ProjectController.updateProject);

router.delete("/:id", protect, ProjectController.deleteProject);

router.put(
  "/:id/members/:memberId",
  protect,
  ProjectController.updateProjectMember,
);

router.delete(
  "/:id/members/:memberId",
  protect,
  ProjectController.removeProjectMember,
);

export default router;