import Permission from "../models/auth/permissions.model.js";
import { catchAsync } from "../middlewares/error.mdw.js";
import { AppError } from "../middlewares/error.mdw.js";

/**
 * Lấy tất cả quyền
 * @route GET /api/permissions
 * @access Admin
 */
export const getAllPermissions = catchAsync(async (req, res) => {
  const permissions = await Permission.find();
  
  res.status(200).json({
    success: true,
    count: permissions.length,
    data: permissions
  });
});

/**
 * Lấy quyền theo ID
 * @route GET /api/permissions/:id
 * @access Admin
 */
export const getPermissionById = catchAsync(async (req, res, next) => {
  const permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new AppError("Không tìm thấy quyền với ID này", 404));
  }
  
  res.status(200).json({
    success: true,
    data: permission
  });
});

/**
 * Tạo quyền mới
 * @route POST /api/permissions
 * @access Admin
 */
export const createPermission = catchAsync(async (req, res, next) => {
  const { code, description } = req.body;

  // Kiểm tra quyền đã tồn tại chưa
  const permissionExists = await Permission.findOne({ code });
  if (permissionExists) {
    return next(new AppError("Mã quyền này đã tồn tại", 400));
  }

  const permission = await Permission.create({
    code,
    description
  });
  
  res.status(201).json({
    success: true,
    data: permission
  });
});

/**
 * Cập nhật quyền
 * @route PUT /api/permissions/:id
 * @access Admin
 */
export const updatePermission = catchAsync(async (req, res, next) => {
  const { code, description } = req.body;
  
  let permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new AppError("Không tìm thấy quyền với ID này", 404));
  }
  
  // Kiểm tra nếu thay đổi mã sẽ gây trùng lặp
  if (code !== permission.code) {
    const existingPermission = await Permission.findOne({ code });
    if (existingPermission) {
      return next(new AppError("Mã quyền này đã tồn tại", 400));
    }
  }
  
  permission = await Permission.findByIdAndUpdate(
    req.params.id, 
    { code, description },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: permission
  });
});

/**
 * Xóa quyền
 * @route DELETE /api/permissions/:id
 * @access Admin
 */
export const deletePermission = catchAsync(async (req, res, next) => {
  const permission = await Permission.findById(req.params.id);
  
  if (!permission) {
    return next(new AppError("Không tìm thấy quyền với ID này", 404));
  }
  
  await Permission.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});