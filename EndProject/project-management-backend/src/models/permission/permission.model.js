import mongoose from "mongoose";
import Collection from "../config/collection.js";

const permissionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: [
        // Quyền dự án
        "view_project",
        "create_project",
        "edit_project",
        "delete_project",
        
        // Quyền nhiệm vụ
        "view_task",
        "create_task",
        "edit_task",
        "delete_task",
        "assign_task",
        "comment_task",
        "create_task_label",
        "edit_task_label",
        "delete_task_label",
        
        // Quyền thành viên
        "manage_project_members",
        
        // Quyền tài nguyên
        "manage_resources",
        
        // Quyền báo cáo
        "view_report",
        
        // Quyền giao tiếp nhóm
        "team_communication",
        
        // Quyền cảnh báo
        "manage_alerts",
        
        // Quyền tài khoản
        "manage_account",
          
        // Quyền tiến độ
        "track_project_progress",
        "manage_project_progress",
        
        // Quyền quản trị hệ thống riêng leader 
        "manage_staff",
        "manage_security",
        "manage_support",
        "manage_notifications",
        "manage_timeline",
      ],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const Permission = mongoose.model(Collection.auth.PERMISSION, permissionSchema);
export default Permission;