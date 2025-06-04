import express from "express";
import {
  getAllRolePermissions,
  getPermissionsByRoleId,
  assignPermissionToRole,
  removePermissionFromRole,
  assignPermissionsToRole,
} from "../controllers/rolePermission.controllers.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Tất cả routes có yêu cầu xác thực người dùng
// router.use(protect);

// Lấy tất cả phân quyền
router.get("/", getAllRolePermissions);

// Gán quyền cho vai trò
router.post("/", assignPermissionToRole);

// Xóa phân quyền theo ID
router.delete("/:id", removePermissionFromRole);

// Lấy quyền của vai trò theo ID vai trò
router.get("/roles/:roleId/permissions", getPermissionsByRoleId);

// Gán nhiều quyền cho vai trò
router.post("/roles/:roleId/permissions", assignPermissionsToRole);

export default router;
// 4. API Phân quyền (RolePermission Routes)
// Lấy tất cả phân quyền
// Method: GET
// URL: http://localhost:8000/api/role-permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)

// Gán quyền cho vai trò
// Method: POST
// URL: http://localhost:8000/api/role-permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "roleId": "[role_id]",
//   "permissionId": "[permission_id]"
// }


// lấy quyền của vai trò theo ID vai trò
// Method: GET
// URL: http://localhost:8000/api/role-permissions/roles/[role_id]/permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)

//gan nhiều quyền cho vai trò
// Method: POST
// URL: http://localhost:8000/api/role-permissions/roles/[role_id]/permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "permissionIds": ["permission_id1", "permission_id2", "permission_id3"]
// }

//xóa phân quyền theo ID
// Method: DELETE
// URL: http://localhost:8000/api/role-permissions/[role_permission_id]
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)


