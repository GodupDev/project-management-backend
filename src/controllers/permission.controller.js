import Permission from "../models/permission.model.js";

// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ code: 1 });
    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permissions",
      error: error.message,
    });
  }
};

// Get permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch permission",
      error: error.message,
    });
  }
};

// Create new permission
export const createPermission = async (req, res) => {
  try {
    const { code, description } = req.body;
    
    // Check if permission already exists
    const existingPermission = await Permission.findOne({ code });
    if (existingPermission) {
      return res.status(409).json({
        success: false,
        message: "Permission with this code already exists",
      });
    }
    
    const permission = await Permission.create({
      code,
      description: description || "",
    });
    
    res.status(201).json({
      success: true,
      data: permission,
      message: "Permission created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create permission",
      error: error.message,
    });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { description } = req.body;
    
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    
    // Only description can be updated, code is an enum and should not be changed
    permission.description = description;
    await permission.save();
    
    res.status(200).json({
      success: true,
      data: permission,
      message: "Permission updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update permission",
      error: error.message,
    });
  }
};

// Delete permission
export const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    
    await permission.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete permission",
      error: error.message,
    });
  }
};