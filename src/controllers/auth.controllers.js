import User from "../models/main/users.model.js";
import UserProfile from "../models/main/userProfiles.model.js";
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

      const userProfile = await UserProfile.create({
        userId: user._id,
        fullName: username, // Sử dụng tên người dùng làm tên đầy đủ mặc định
      });

      user.userProfileId = userProfile._id;
      await user.save();

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

      // Kiểm tra mật khẩu có khớp không
      const user = await User.findOne({ email }).select("+password");
      const isMatch = await user.matchPassword(password);
      if (!isMatch || !user) {
        return res.status(401).json({
          success: false,
          message: "Thông tin đăng nhập không hợp lệ",
        });
      }

      user.isActive = true;
      await user.save();

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
        data: user,
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
      const user = await User.findById(userId);

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
      await UserProfile.findOneAndDelete({ userId });

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

  // Đổi mật khẩu
  changePassword: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { oldPassword, newPassword } = req.body;
      const userId = req.user._id;

      // Tìm người dùng
      const user = await User.findById(userId).select("+password");
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      // Kiểm tra mật khẩu cũ
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu cũ không đúng",
        });
      }

      // Cập nhật mật khẩu mới
      user.password = newPassword;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Đổi mật khẩu thất bại",
        error: error.message,
      });
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Thiếu địa chỉ email trong truy vấn",
        });
      }

      // Tìm người dùng theo email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Người dùng không tồn tại",
        });
      }

      const userProfile = await UserProfile.findOne({ userId: user._id });

      return res.status(200).json({
        success: true,
        message: "Tìm người dùng thành công",
        data: {
          _id: user._id,
          fullName: userProfile.fullName,
          avatarUrl: userProfile.avatarUrl,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tìm người dùng",
        error: error.message,
      });
    }
  },
};

export default AuthController;
