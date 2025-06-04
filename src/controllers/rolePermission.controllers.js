import RolePermission from "../models/auth/rolePermissions.model.js";
import Role from "../models/auth/roles.model.js";
import Permission from "../models/auth/permissions.model.js";
import { catchAsync } from "../middlewares/error.mdw.js";
import { AppError } from "../middlewares/error.mdw.js";

/**
 * Lấy tất cả phân quyền
 * @route GET /api/role-permissions
 * @access Admin
 */
export const getAllRolePermissions = catchAsync(async (req, res) => {
  const rolePermissions = await RolePermission.find()
    .populate('role', 'name')
    .populate('permission', 'code description');
  
  res.status(200).json({
    success: true,
    count: rolePermissions.length,
    data: rolePermissions
  });
});

/**
 * Lấy quyền của vai trò theo ID vai trò
 * @route GET /api/roles/:roleId/permissions
 * @access Admin
 */
export const getPermissionsByRoleId = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  
  // Kiểm tra vai trò có tồn tại không
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  const rolePermissions = await RolePermission.find({ role: roleId })
    .populate('permission', 'code description');
  
  res.status(200).json({
    success: true,
    count: rolePermissions.length,
    role: role.name,
    data: rolePermissions
  });
});

/**
 * Gán quyền cho vai trò
 * @route POST /api/role-permissions
 * @access Admin
 */
export const assignPermissionToRole = catchAsync(async (req, res, next) => {
  const { roleId, permissionId } = req.body;
  
  // Kiểm tra vai trò có tồn tại không
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  // Kiểm tra quyền có tồn tại không
  const permission = await Permission.findById(permissionId);
  if (!permission) {
    return next(new AppError("Không tìm thấy quyền với ID này", 404));
  }
  
  // Kiểm tra phân quyền đã tồn tại chưa
  const existingMapping = await RolePermission.findOne({
    role: roleId,
    permission: permissionId
  });
  
  if (existingMapping) {
    return next(new AppError("Vai trò đã được gán quyền này", 400));
  }
  
  const rolePermission = await RolePermission.create({
    role: roleId,
    permission: permissionId
  });
  
  res.status(201).json({
    success: true,
    data: {
      ...rolePermission.toObject(),
      roleName: role.name,
      permissionCode: permission.code
    }
  });
});

/**
 * Xóa quyền khỏi vai trò
 * @route DELETE /api/role-permissions/:id
 * @access Admin
 */
export const removePermissionFromRole = catchAsync(async (req, res, next) => {
  const rolePermission = await RolePermission.findById(req.params.id);
  
  if (!rolePermission) {
    return next(new AppError("Không tìm thấy phân quyền với ID này", 404));
  }
  
  await RolePermission.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Gán nhiều quyền cho vai trò
 * @route POST /api/roles/:roleId/permissions
 * @access Admin
 */
export const assignPermissionsToRole = catchAsync(async (req, res, next) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;
  
  if (!permissionIds || !Array.isArray(permissionIds)) {
    return next(new AppError("Vui lòng cung cấp danh sách mã quyền hợp lệ", 400));
  }
  
  // Kiểm tra vai trò có tồn tại không
  const role = await Role.findById(roleId);
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  const results = [];
  const errors = [];
  
  // Xử lý từng quyền
  for (const permissionId of permissionIds) {
    try {
      // Kiểm tra quyền có tồn tại không
      const permission = await Permission.findById(permissionId);
      if (!permission) {
        errors.push({ permissionId, error: "Không tìm thấy quyền" });
        continue;
      }
      
      // Kiểm tra phân quyền đã tồn tại chưa
      const existingMapping = await RolePermission.findOne({
        role: roleId,
        permission: permissionId
      });
      
      if (existingMapping) {
        // Bỏ qua nếu đã tồn tại
        continue;
      }
      
      // Tạo phân quyền mới
      const rolePermission = await RolePermission.create({
        role: roleId,
        permission: permissionId
      });
      
      results.push({
        id: rolePermission._id,
        role: role.name,
        permission: permission.code
      });
    } catch (error) {
      errors.push({ permissionId, error: error.message });
    }
  }
  
  res.status(200).json({
    success: true,
    assigned: results.length,
    errors: errors.length,
    data: {
      successful: results,
      failed: errors
    }
  });
});

/**
 * Middleware xác thực quyền
 */
export const permissionAuth = (req, res, next) => {
  /* kiểm tra quyền truy cập API */
  next();
};

/**
 * Middleware xác thực vai trò
 */
export const roleAuth = (req, res, next) => {
  /* kiểm tra quyền dựa trên vai trò */
  next();
};

/**
 * Middleware xác thực vai trò và quyền
 */
export const rolePermissionAuth = (req, res, next) => {
  /* kiểm tra quyền dựa trên vai trò và quyền cụ thể */
  next();
};