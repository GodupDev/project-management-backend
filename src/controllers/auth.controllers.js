import User from "../models/main/users.model.js";
import Role from "../models/auth/roles.model.js";
import { validationResult } from "express-validator";

// Đăng ký người dùng mới
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, username, roleName } = req.body;

    // Kiểm tra xem người dùng đã tồn tại chưa
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email hoặc tên người dùng đã tồn tại",
      });
    }

    // Lấy ID vai trò từ tên vai trò
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }

    // Tạo người dùng
    const user = await User.create({
      email,
      password,
      username,
      role: role._id, // Thêm dòng này để gán role
    });

    // Tạo token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: roleName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đăng ký người dùng thất bại",
      error: error.message,
    });
  }
};

// Đăng nhập người dùng
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user và populate role
    const user = await User.findOne({ email })
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra role đã được populate chưa
    if (!user.role) {
      return res.status(403).json({
        success: false,
        message:
          "Tài khoản của bạn không có vai trò. Vui lòng liên hệ quản trị viên.",
      });
    }

    // Kiểm tra mật khẩu có khớp không
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }

    // Tạo token
    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      token,
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đăng nhập thất bại",
      error: error.message,
    });
  }
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("role");

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin người dùng",
      error: error.message,
    });
  }
};