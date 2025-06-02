import { body } from "express-validator";

export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Vui lòng cung cấp email hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Tên người dùng phải có ít nhất 3 ký tự"),
  body("roleName")
    .isIn(["Leader", "Staff"])
    .withMessage("Vai trò phải là 'Leader' hoặc 'Staff'"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Vui lòng cung cấp email hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự"),
];
// Validate time log input
export const validateTimeLogInput = (taskId, startTime, endTime) => {
  // Check if taskId is valid MongoDB ObjectId
  if (taskId && !mongoose.Types.ObjectId.isValid(taskId)) {
      return 'Invalid task ID';
  }

  // Check if startTime and endTime are valid dates
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start.getTime())) {
      return 'Invalid start time';
  }

  if (isNaN(end.getTime())) {
      return 'Invalid end time';
  }

  // Check if endTime is after startTime
  if (end <= start) {
      return 'End time must be after start time';
  }

  return null;
};

// Validate project input
export const validateProjectInput = (name, description, startDate, endDate) => {
  if (!name || name.trim().length === 0) {
      return 'Project name is required';
  }

  if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime())) {
          return 'Invalid start date';
      }

      if (isNaN(end.getTime())) {
          return 'Invalid end date';
      }

      if (end <= start) {
          return 'End date must be after start date';
      }
  }

  return null;
};

// Validate task input
export const validateTaskInput = (title, projectId, startDate, dueDate) => {
  if (!title || title.trim().length === 0) {
      return 'Task title is required';
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return 'Invalid project ID';
  }

  if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);

      if (isNaN(start.getTime())) {
          return 'Invalid start date';
      }

      if (isNaN(due.getTime())) {
          return 'Invalid due date';
      }

      if (due <= start) {
          return 'Due date must be after start date';
      }
  }

  return null;
};

// Validate tag input
export const validateTagInput = (name, projectId, color) => {
  if (!name || name.trim().length === 0) {
      return 'Tag name is required';
  }

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return 'Invalid project ID';
  }

  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return 'Invalid color format (should be hex color code)';
  }

  return null;
};