import { body } from "express-validator";

export const validateRegister = [
  body("email").isEmail().withMessage("Vui lòng cung cấp email hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Tên người dùng phải có ít nhất 3 ký tự"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Vui lòng cung cấp email hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];
