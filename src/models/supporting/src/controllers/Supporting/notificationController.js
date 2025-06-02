
import Notification from "../models/notificationModel.js";
import { generateNotificationMessage } from "../utils/notificationMessage.js";
import Task from "../models/taskModel.js";
import UsersModel from "../models/userModel.js";

// Tạo notification mới
export const createNotification = async (req, res) => {
  try {
    const { userId, taskId, action } = req.body;

    const user = await UsersModel.findById(userId);
    const task = await Task.findById(taskId);
    if (!user || !task) {
      return res.status(404).json({ message: "User hoặc Task không tồn tại" });
    }

    const message = generateNotificationMessage({
      userName: user.userName,
      action,
      taskName: task.taskName,
      time: new Date().toLocaleString("vi-VN"),
    });

    const newNotification = new Notification({
      userId,
      taskId,
      message,
    });

    await newNotification.save();

    res.status(201).json({
      message: "Tạo notification thành công",
      data: newNotification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Lấy danh sách notification của user
export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy notification" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Đã đánh dấu đã đọc", data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
