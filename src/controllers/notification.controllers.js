import createNotification from "../services/notification.service.js";

import ProjectMemberModel from "../models/main/projectMember.model.js";
import NotificationModel from "../models/supporting/notification.model.js";

const NotificationController = {
  addNotification: async (req, res) => {
    try {
      const newNotification = await createNotification(req.body);

      return res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: newNotification,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create notification",
      });
    }
  },

  getNotifications: async (req, res) => {
    try {
      const userId = req.user._id;

      // Lấy giá trị isRead từ query params, ví dụ: ?isRead=true
      // Nếu không truyền sẽ không lọc theo isRead
      const { isRead, containAuthor } = req.query;

      // Lấy danh sách projectId mà user tham gia
      const projectMembers = await ProjectMemberModel.find({ userId }).select(
        "projectId -_id",
      );

      const projectIds = projectMembers.map((pm) => pm.projectId);

      const authorId = containAuthor ? req.user._id : null;
      // Build filter object
      const filter = {
        projectId: { $in: projectIds },
        authorId: { $ne: authorId },
      };

      // Nếu có isRead trong query, chuyển sang Boolean và thêm vào filter
      if (typeof isRead !== "undefined") {
        filter.isRead = isRead === "true"; // query params luôn là string
      }

      // Tìm thông báo với filter
      const notifications = await NotificationModel.find(filter).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        message: "Notifications retrieved successfully",
        data: notifications,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve notifications",
      });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;

      // Kiểm tra xem thông báo có tồn tại không
      const notification = await NotificationModel.findById(notificationId);
      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      // Xóa thông báo
      await NotificationModel.findByIdAndDelete(notificationId);

      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete notification",
      });
    }
  },

  markNotificationAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user._id;

      if (notificationId === "all") {
        // Cập nhật tất cả notification của user (hoặc của các project user tham gia) là đã đọc
        // Nếu bạn lưu projectId trong notification thì có thể lọc theo projectId hoặc theo userId (tùy schema)

        // Ví dụ: cập nhật tất cả notification của user (authorId là userId)
        // Nếu bạn muốn cập nhật tất cả notification thuộc các project user tham gia, bạn cần lấy projectIds như trong getNotifications

        // Nếu notification có trường userId hoặc tương tự, lọc theo đó
        const updateResult = await NotificationModel.updateMany(
          { authorId: userId, isRead: false },
          { $set: { isRead: true } },
        );

        return res.status(200).json({
          success: true,
          message: `Marked ${updateResult.modifiedCount} notifications as read.`,
        });
      } else {
        // Đánh dấu 1 notification cụ thể
        const notification = await NotificationModel.findById(notificationId);
        if (!notification) {
          return res.status(404).json({
            success: false,
            message: "Notification not found",
          });
        }

        notification.isRead = true;
        await notification.save();

        // Gửi thông báo đến Firebase Cloud Messaging nếu cần (phần này bạn giữ nguyên)
        const message = {
          notification: {
            title: "Notification Read",
            body: `Your notification with ID ${notificationId} has been marked as read.`,
          },
          token: notification.deviceToken,
        };

        await auth().send(message);

        return res.status(200).json({
          success: true,
          message: "Notification marked as read successfully",
          data: notification,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to mark notification as read",
      });
    }
  },
};

export default NotificationController;
