import Notification from "../models/notification.model.js";
import NotificationSetting from "../models/notificationSetting.model.js";
import { catchAsync, AppError } from "../middlewares/error.mdw.js";

// Get all notifications for the current user
export const getNotifications = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const query = { user: req.user._id };
  
  // Lọc theo trạng thái đọc nếu có
  if (req.query.isRead !== undefined) {
    query.isRead = req.query.isRead === 'true';
  }
  
  // Lọc theo loại thông báo nếu có
  if (req.query.type) {
    query.type = req.query.type;
  }
  
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ 
    user: req.user._id,
    isRead: false
  });
  
  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    unreadCount,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: notifications,
  });
});

// Các phương thức khác giữ nguyên...

// Thêm API lấy và cập nhật cài đặt thông báo
export const getNotificationSettings = catchAsync(async (req, res, next) => {
  let settings = await NotificationSetting.findOne({ user: req.user._id });
  
  if (!settings) {
    // Tạo cài đặt mặc định nếu chưa có
    settings = await NotificationSetting.create({ user: req.user._id });
  }
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

export const updateNotificationSettings = catchAsync(async (req, res, next) => {
  const { email, push, desktop } = req.body;
  
  let settings = await NotificationSetting.findOne({ user: req.user._id });
  
  if (!settings) {
    settings = await NotificationSetting.create({ 
      user: req.user._id,
      email: email || undefined,
      push: push || undefined,
      desktop: desktop || undefined
    });
  } else {
    // Cập nhật từng nhóm cài đặt nếu có
    if (email) settings.email = { ...settings.email, ...email };
    if (push) settings.push = { ...settings.push, ...push };
    if (desktop) settings.desktop = { ...settings.desktop, ...desktop };
    
    await settings.save();
  }
  
  res.status(200).json({
    success: true,
    message: "Cài đặt thông báo đã được cập nhật",
    data: settings
  });
});