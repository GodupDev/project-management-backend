import Role from "../models/auth/roles.model.js";
import { catchAsync } from "../middlewares/error.mdw.js";
import { AppError } from "../middlewares/error.mdw.js";

/**
 * Lấy tất cả vai trò
 * @route GET /api/roles
 * @access Admin
 */
export const getAllRoles = catchAsync(async (req, res) => {
  const roles = await Role.find();
  
  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles
  });
});

/**
 * Lấy vai trò theo ID
 * @route GET /api/roles/:id
 * @access Admin
 */
export const getRoleById = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  res.status(200).json({
    success: true,
    data: role
  });
});

/**
 * Tạo vai trò mới
 * @route POST /api/roles
 * @access Admin
 */
export const createRole = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;

  // Kiểm tra vai trò đã tồn tại chưa
  const roleExists = await Role.findOne({ name });
  if (roleExists) {
    return next(new AppError("Vai trò này đã tồn tại", 400));
  }

  const role = await Role.create({
    name,
    description
  });
  
  res.status(201).json({
    success: true,
    data: role
  });
});

/**
 * Cập nhật vai trò
 * @route PUT /api/roles/:id
 * @access Admin
 */
export const updateRole = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  
  let role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  // Kiểm tra nếu thay đổi tên sẽ gây trùng lặp
  if (name !== role.name) {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return next(new AppError("Tên vai trò này đã tồn tại", 400));
    }
  }
  
  role = await Role.findByIdAndUpdate(
    req.params.id, 
    { name, description },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: role
  });
});

/**
 * Xóa vai trò
 * @route DELETE /api/roles/:id
 * @access Admin
 */
export const deleteRole = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new AppError("Không tìm thấy vai trò với ID này", 404));
  }
  
  await Role.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});