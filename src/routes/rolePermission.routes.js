import express from "express";
import {
  getPermissionsByRole,
  assignPermissionToRole,
  removePermissionFromRole,
  bulkAssignPermissions,
  checkRolePermission
} from "../controllers/rolePermission.controller.js";

const router = express.Router();

router.get("/role/:roleId", getPermissionsByRole);
router.post("/assign", assignPermissionToRole);
router.delete("/role/:roleId/permission/:permissionId", removePermissionFromRole);
router.post("/bulk-assign", bulkAssignPermissions);
router.get("/check/:roleId/:permissionCode", checkRolePermission);

export default router;