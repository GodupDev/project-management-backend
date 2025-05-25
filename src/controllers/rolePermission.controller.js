import RolePermission from "../models/RolePermission.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import mongoose from "mongoose";

// Get all permissions assigned to a role
export const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Check if role exists
    const roleExists = await Role.exists({ _id: roleId });
    if (!roleExists) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const rolePermissions = await RolePermission.find({ role: roleId })
      .populate("permission", "code description");
    
    const permissions = rolePermissions.map(rp => rp.permission);

    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions for role",
      error: error.message,
    });
  }
};

// Assign a permission to a role
export const assignPermissionToRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.body;

    // Validate roleId and permissionId
    if (!mongoose.Types.ObjectId.isValid(roleId) || 
        !mongoose.Types.ObjectId.isValid(permissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID or permission ID",
      });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if permission exists
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }

    // Check if the assignment already exists
    const existingAssignment = await RolePermission.findOne({
      role: roleId,
      permission: permissionId,
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: "Permission is already assigned to this role",
      });
    }

    const rolePermission = await RolePermission.create({
      role: roleId,
      permission: permissionId,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: rolePermission._id,
        role: role.name,
        permission: permission.code,
      },
      message: "Permission assigned to role successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to assign permission to role",
      error: error.message,
    });
  }
};

// Remove a permission from a role
export const removePermissionFromRole = async (req, res) => {
  try {
    const { roleId, permissionId } = req.params;

    const rolePermission = await RolePermission.findOne({
      role: roleId,
      permission: permissionId,
    });

    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: "This permission is not assigned to the role",
      });
    }

    await rolePermission.deleteOne();

    res.status(200).json({
      success: true,
      message: "Permission removed from role successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove permission from role",
      error: error.message,
    });
  }
};

// Bulk assign permissions to a role
export const bulkAssignPermissions = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const { roleId, permissionIds } = req.body;
    
    // Validate roleId
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }
    
    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    
    // Clear existing permissions for this role
    await RolePermission.deleteMany({ role: roleId }, { session });
    
    // Create bulk operations array
    const operations = [];
    for (const permId of permissionIds) {
      if (mongoose.Types.ObjectId.isValid(permId)) {
        operations.push({
          role: roleId,
          permission: permId,
        });
      }
    }
    
    // Insert new permissions
    if (operations.length > 0) {
      await RolePermission.insertMany(operations, { session });
    }
    
    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: `Successfully assigned ${operations.length} permissions to ${role.name} role`,
    });
  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({
      success: false,
      message: "Failed to assign permissions to role",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Check if a role has a specific permission
export const checkRolePermission = async (req, res) => {
  try {
    const { roleId, permissionCode } = req.params;
    
    // First get the permission ID from the code
    const permission = await Permission.findOne({ code: permissionCode });
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    
    // Check if the role has this permission
    const rolePermission = await RolePermission.findOne({
      role: roleId,
      permission: permission._id,
    });
    
    res.status(200).json({
      success: true,
      hasPermission: !!rolePermission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check role permission",
      error: error.message,
    });
  }
};