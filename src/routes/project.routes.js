import express from "express";
import ProjectController from "../controllers/project.controller.js";
import { protect, checkRoleAndPermission } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Project routes
router.post("/", protect, ProjectController.createProject);

router.get(
  "/",
  protect,
  checkRoleAndPermission(["Leader", "Staff"], "view_project"),
  ProjectController.getAllProjects,
);

router.get(
  "/:id",
  protect,
  checkRoleAndPermission(["Leader", "Staff"], "view_project"),
  ProjectController.getProjectById,
);

router.put(
  "/:id",
  protect,
  checkRoleAndPermission(["Leader"], "update_project"),
  ProjectController.updateProject,
);

router.delete(
  "/:id",
  protect,
  checkRoleAndPermission(["Leader"], "delete_project"),
  ProjectController.deleteProject,
);

// Project member routes
router.post(
  "/:id/members",
  protect,
  checkRoleAndPermission(["Leader"], "manage_project_members"),
  ProjectController.addProjectMember,
);

router.get(
  "/:id/members",
  protect,
  checkRoleAndPermission(["Leader", "Staff"], "view_project_members"),
  ProjectController.getProjectMembers,
);

router.delete(
  "/:id/members/:memberId",
  protect,
  checkRoleAndPermission(["Leader"], "manage_project_members"),
  ProjectController.removeProjectMember,
);

export default router;
