import User from "../models/main/users.model.js";
import UserProfileModel from "../models/main/userProfiles.model.js";
import { validationResult } from "express-validator";

const AuthController = {
  // Đăng ký người dùng mới
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username } = req.body;

      // Kiểm tra xem người dùng đã tồn tại chưa
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: "Email hoặc tên người dùng đã tồn tại",
        });
      }
      // Tạo người dùng
      const user = await User.create({
        email,
        password,
        username,
        isActive: true, // Tài khoản mới mặc định đang hoạt động
      });

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đăng ký người dùng thất bại",
        error: error.message,
      });
    }
  },

  // Đăng nhập người dùng
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Kiểm tra xem người dùng tồn tại không
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Thông tin đăng nhập không hợp lệ",
        });
      }

      // Kiểm tra tài khoản có đang hoạt động không
      user.isActive = true;

      await user.save();

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

      return res.status(200).json({
        success: true,
        token,
        data: {
          _id: user._id,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đăng nhập thất bại",
        error: error.message,
      });
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          username: user.username,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Không thể lấy thông tin người dùng",
        error: error.message,
      });
    }
  },

  // Đăng xuất người dùng
  signout: async (req, res) => {
    try {
      // Trong trường hợp sử dụng JWT, chúng ta không cần làm gì ở phía server
      // vì JWT là stateless. Client sẽ tự xóa token.
      const userId = req.user._id;
      const user = await ProjectModel.findById(userId);

      user.isActive = false;
      user.save();

      return res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đăng xuất thất bại",
        error: error.message,
      });
    }
  },

  // Xóa tài khoản
  deleteAccount: async (req, res) => {
    try {
      const userId = req.user._id;

      // Xóa người dùng
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      // Xóa thông tin hồ sơ người dùng
      await UserProfileModel.findOneAndDelete({ userId });

      return res.status(200).json({
        success: true,
        message: "Tài khoản đã được xóa thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Xóa tài khoản thất bại",
        error: error.message,
      });
    }
  },
};

export default AuthController;
