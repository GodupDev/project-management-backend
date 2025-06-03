import express from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controllers.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Tất cả routes có yêu cầu xác thực người dùng
router.use(protect);

// Lấy tất cả vai trò
router.get("/", getAllRoles);

// Lấy vai trò theo ID
router.get("/:id", getRoleById);

// Tạo vai trò mới
router.post("/", createRole);

// Cập nhật vai trò
router.put("/:id", updateRole);

// Xóa vai trò
router.delete("/:id", deleteRole);

export default router;

// 2. API Vai trò (Role Routes)
// Lấy danh sách vai trò
// Method: GET
// URL: http://localhost:8000/api/roles
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)

// Tạo vai trò mới
// Method: POST
// URL: http://localhost:8000/api/roles
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "name": "leader",
//   "description": "Người quản lý dự án"
// }

// Cập nhật vai trò
// Method: PUT
// URL: http://localhost:8000/api/roles/[role_id]
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)
// Body:
// {
//   "name": "leader",
//   "description": "Người quản lý dự án cấp cao"
// }

// Xóa vai trò
// Method: DELETE
// URL: http://localhost:8000/api/roles/[role_id]
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token] (nếu middleware protect được kích hoạt)