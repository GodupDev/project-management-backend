import notificationService from "../services/firebase/notification.service.js";

class NotificationController {
  // Get notifications for a specific project
  async getProjectNotifications(req, res) {
    try {
      const { projectId } = req.params;
      const { userId } = req.query;

      let notifications;
      if (userId) {
        notifications = await notificationService.getUserProjectNotifications(
          userId,
          projectId,
        );
      } else {
        notifications = await notificationService.getProjectNotifications(
          projectId,
        );
      }

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new notification
  async createNotification(req, res) {
    try {
      const {
        actionType,
        taskName,
        userId,
        taskId,
        projectId,
        additionalInfo,
      } = req.body;

      if (!actionType || !userId || !projectId) {
        return res.status(400).json({
          error: "Action type, userId, and projectId are required",
        });
      }

      const notificationId = await notificationService.createNewNotification({
        actionType,
        taskName,
        userId,
        taskId,
        projectId,
        additionalInfo,
      });

      res.status(201).json({
        message: "Notification created successfully",
        notificationId,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: error.message });
    }
  }

  // Mark a notification as read
  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      await notificationService.markAsRead(notificationId);

      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mark all notifications as read for a project
  async markAllAsRead(req, res) {
    try {
      const { projectId } = req.params;
      const { userId } = req.query;

      await notificationService.markAllAsRead(projectId, userId);

      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new NotificationController();
