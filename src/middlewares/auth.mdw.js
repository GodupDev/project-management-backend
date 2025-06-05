import jwt from "jsonwebtoken";
import User from "../models/main/users.model.js";
import Role from "../models/auth/roles.model.js";
import RolePermission from "../models/auth/rolePermissions.model.js";
import Permission from "../models/auth/permissions.model.js";

// Xác thực JWT token và gắn user vào request
export const protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập tuyến đường này",
      });
    }

    try {
      // Xác thực token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Gắn thông tin user vào request
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy người dùng",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Không có quyền truy cập tuyến đường này",
        error: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Giới hạn truy cập dựa trên vai trò
export const restrictTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: `Vai trò ${req.user.role.name} không có quyền truy cập tuyến đường này`,
      });
    }
    next();
  };
};

// Kiểm tra xem người dùng có quyền cần thiết không
export const hasPermission = (permissionCode) => {
  return async (req, res, next) => {
    try {
      // Lấy vai trò của người dùng
      const userRole = req.user.role._id;

      // Tìm quyền theo mã
      const permission = await Permission.findOne({ code: permissionCode });

      if (!permission) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy quyền",
        });
      }

      // Kiểm tra xem vai trò có quyền này không
      const rolePermission = await RolePermission.findOne({
        role: userRole,
        permission: permission._id,
      });

      if (!rolePermission) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware kết hợp kiểm tra cả vai trò và quyền trong một bước
 * @param {Array} roles - Mảng các tên vai trò được phép
 * @param {String} permissionCode - Mã quyền cần thiết
 */
export const checkRoleAndPermission = (roles, permissionCode) => {
  return async (req, res, next) => {
    try {
      // 1. Kiểm tra đăng nhập - đảm bảo người dùng đã xác thực
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Bạn cần đăng nhập để truy cập tài nguyên này",
        });
      }

      // 2. Kiểm tra vai trò
      const userRole = await Role.findById(req.user.role).populate("name");
      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Không tìm thấy thông tin vai trò của bạn",
        });
      }

      if (!roles.includes(userRole.name)) {
        return res.status(403).json({
          success: false,
          message: `Vai trò ${userRole.name} không có quyền truy cập tài nguyên này`,
        });
      }

      // 3. Kiểm tra quyền
      const permission = await Permission.findOne({ code: permissionCode });
      if (!permission) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy quyền được yêu cầu",
        });
      }

      const rolePermission = await RolePermission.findOne({
        role: req.user.role,
        permission: permission._id,
      });

      if (!rolePermission) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền cần thiết để thực hiện hành động này",
        });
      }

      // Nếu mọi thứ hợp lệ, cho phép tiếp tục
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi kiểm tra quyền truy cập",
        error: error.message,
      });
    }
  };
};

// example middleware kết hợp kiểm tra vai trò và quyền
// import { protect, checkRoleAndPermission } from "../middlewares/auth.mdw.js";

// Route yêu cầu vai trò Leader và quyền tạo dự án
// router.post(
//   "/projects",
//   protect,
//   checkRoleAndPermission(["Leader"], "create_project"),
//   createProject
// );

// Route cho phép cả Leader và Staff xem dự án
// router.get(
//   "/projects/:id",
//   protect,
//   checkRoleAndPermission(["Leader", "Staff"], "view_project"),
//   getProjectById
// );
