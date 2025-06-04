import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controllers.js";
import { validateRegister, validateLogin } from "../middlewares/validate.mdw.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getCurrentUser);

export default router;
//1. API Xác thực (Auth Routes)
//Đăng ký người dùng
// Method: POST
// URL: http://localhost:8000/api/users/register
// Headers: Content-Type: application/json
// Body:
// {
//   "username": "testuser",
//   "email": "testuser@example.com",
//   "password": "123456"
// }

//Đăng nhập người dùng
  // Method: POST
  // URL: http://localhost:8000/api/users/login
  // Headers: Content-Type: application/json
  // Body:
  // {
  //   "email": "testuser@example.com",
  //   "password": "123456"
  // }
  // Response: Lưu token từ response để sử dụng cho các API khác

//Lấy thông tin người dùng hiện tại
// Method: GET
// URL: http://localhost:8000/api/users/me
// Headers: 
//   - Content-Type: application/json
//   - Authorization: Bearer [token_từ_đăng_nhập]
