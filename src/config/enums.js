// config/enums.js
const PROJECT_STATUS = Object.freeze({
  PENDING: "pending",
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

const TASK_STATUS = Object.freeze({
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  COMPLETED: "completed",
});

const ROLE_NAME = Object.freeze({
  LEADER: "leader",
  STAFF: "staff",
});

const PERMISSION_CODE = Object.freeze({
  LEADER: [
    // Dự án
    "view_project",
    "create_project",
    "edit_project",
    "delete_project",

    // Nhiệm vụ
    "view_task",
    "create_task",
    "edit_task",
    "delete_task",
    "assign_task",
    "comment_task",

    // Thành viên
    "manage_project_members",

    // Tài nguyên
    "manage_resources",

    // Báo cáo
    "view_report",

    // Cảnh báo
    "manage_alerts",

    // Hệ thống
    "manage_staff",
    "manage_timeline",
  ],

  STAFF: [
    "view_project",
    "view_task",
    "change_task_status",
    "comment_task",
    "team_communication",
  ],
});

const Enum = { PROJECT_STATUS, TASK_STATUS, ROLE_NAME, PERMISSION_CODE };

export default Enum;
