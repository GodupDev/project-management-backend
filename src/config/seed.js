import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import RolePermission from "../models/rolePermission.model.js";

// Danh sách quyền cơ bản
const permissions = [
  { code: "create_project", description: "Tạo dự án" },
  { code: "view_project", description: "Xem dự án" },
  { code: "update_project", description: "Cập nhật dự án" },
  { code: "delete_project", description: "Xóa dự án" },
  { code: "create_task", description: "Tạo công việc" },
  { code: "view_task", description: "Xem công việc" }
  // Thêm các quyền khác ...
];

// Phân quyền mặc định cho các vai trò
const rolePermissions = {
  Leader: [
    "create_project", "view_project", "update_project", "delete_project",
    "create_task", "view_task"
  ],
  Staff: [
    "view_project", "view_task", "create_task"
  ]
};

export const seedPermissions = async () => {
  try {
    // Tạo quyền
    for (const perm of permissions) {
      await Permission.findOneAndUpdate(
        { code: perm.code },
        perm,
        { upsert: true, new: true }
      );
    }
    console.log("Tạo quyền thành công");
    
    // Tạo liên kết quyền-vai trò
    const roles = await Role.find();
    const perms = await Permission.find();
    
    for (const role of roles) {
      const rolePerms = rolePermissions[role.name] || [];
      
      for (const permCode of rolePerms) {
        const perm = perms.find(p => p.code === permCode);
        if (perm) {
          await RolePermission.findOneAndUpdate(
            { role: role._id, permission: perm._id },
            { role: role._id, permission: perm._id },
            { upsert: true }
          );
        }
      }
    }
    console.log("Phân quyền thành công");
    
  } catch (error) {
    console.error("Lỗi tạo dữ liệu:", error);
  }
};