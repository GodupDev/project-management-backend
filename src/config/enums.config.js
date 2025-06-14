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

const NOTIFICATION_TYPES = Object.freeze({
  // Task notifications
  TASK_CREATED: "task_created",
  TASK_UPDATED: "task_updated",
  TASK_DELETED: "task_deleted",
  TASK_ASSIGNED: "task_assigned",
  TASK_CHANGE_STATUS: "task_change_status",
  TASK_COMMENT_ADDED: "task_comment_added",

  // Project notifications
  PROJECT_CREATED: "project_created",
  PROJECT_UPDATED: "project_updated",
  PROJECT_DELETED: "project_deleted",
  PROJECT_MEMBER_ADDED: "project_member_added",
  PROJECT_MEMBER_REMOVED: "project_member_removed",
  PROJECT_MEMBER_UPDATED: "project_member_updated",

  TASK_UPDATE: "TASK_UPDATE",
  PROJECT_UPDATE: "PROJECT_UPDATE", 
  MENTION: "MENTION",
  COMMENT: "COMMENT",
  SYSTEM_UPDATE: "SYSTEM_UPDATE"
});

const Enum = {
  PROJECT_STATUS,
  TASK_STATUS,
  ROLE_NAME,
  PERMISSION_CODE,
  NOTIFICATION_TYPES,
};

export default Enum;
