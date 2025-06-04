import express from "express";
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controllers.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Tất cả routes có yêu cầu xác thực người dùng
router.use(protect);

// Lấy tất cả quyền
router.get("/", getAllPermissions);

// Lấy quyền theo ID
router.get("/:id", getPermissionById);

// Tạo quyền mới
router.post("/", createPermission);

// Cập nhật quyền
router.put("/:id", updatePermission);

// Xóa quyền
router.delete("/:id", deletePermission);

export default router;


// 3. API Quyền (Permission Routes)
// Lấy danh sách quyền
// Method: GET
// URL: http://localhost:8000/api/permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)

// Tạo quyền mới
// Method: POST
// URL: http://localhost:8000/api/permissions
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "code": "create_project",
//   "description": "Quyền tạo dự án mới"
// }

// Cập nhật quyền
// Method: PUT
// URL: http://localhost:8000/api/permissions/[permission_id]
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "code": "create_project",
//   "description": "Tạo dự án mới trong hệ thống"
// }


// Xóa quyền
// Method: DELETE
// URL: http://localhost:8000/api/permissions/[permission_id]
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)




