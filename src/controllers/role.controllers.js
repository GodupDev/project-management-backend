import Role from "../models/role.model.js";
import { catchAsync, AppError } from "../middlewares/error.mdw.js";

//get all roles
export const getAllRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.find().sort({ name: 1 });
  
  res.status(200).json({
    success: true,
    count: roles.length,
    data: roles,
  });
});

// get role by id
export const getRoleById = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  
  if (!role) {
    return next(new AppError("Role is not found", 404));
  }
  
  res.status(200).json({
    success: true,
    data: role,
  });
});

// create new role
export const createRole = catchAsync(async (req, res, next) => {
  const { name, description } = req.body;
  
  // check existing role
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    return next(new AppError("Role with this name existed", 409));
  }
  
  // check valid role name
  if (!["Leader", "Staff"].includes(name)) {
    return next(new AppError("Name role must be 'Leader' or 'Staff'", 400));
  }
  
  const role = await Role.create({
    name,
    description: description || "",
  });
  
  console.log("Role created:", role); // logging the created role
  
  res.status(201).json({
    success: true,
    data: role,
    message: "Role created successfully",
  });
});

// Update role
export const updateRole = catchAsync(async (req, res, next) => {
  const { description } = req.body;
  
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new AppError("Role is not found", 404));
  }
  
  // Only update description
  role.description = description;
  await role.save();
  
  res.status(200).json({
    success: true,
    data: role,
    message: "Role updated successfully",
  });
});

// Delete role
export const deleteRole = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return next(new AppError("Role is not found", 404));
  }
  
  await role.deleteOne();
  
  res.status(200).json({
    success: true,
    message: "Role deleted successfully",
  });
});