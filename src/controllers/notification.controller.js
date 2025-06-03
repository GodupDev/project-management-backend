import notificationService from "../services/firebase/notification.service.js";

class NotificationController {
  // Get all notifications for a project
  async getProjectNotifications(req, res) {
    try {
      const { projectId } = req.params;
      const { userId } = req.query;

      // Set up real-time subscription
      const unsubscribe = notificationService.subscribeToProjectNotifications(
        projectId,
        (notifications) => {
          // Filter notifications for specific user if userId is provided
          const filteredNotifications = userId
            ? notifications.filter((n) => n.userId === userId)
            : notifications;

          // Send notifications through WebSocket or SSE
          if (req.app.get("io")) {
            req.app
              .get("io")
              .to(projectId)
              .emit("notifications", filteredNotifications);
          }
        },
      );

      // Store unsubscribe function for cleanup
      req.on("close", () => {
        unsubscribe();
      });

      res.status(200).json({ message: "Listening for project notifications" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get notifications for a specific project (non-realtime)
  async getProjectNotificationsList(req, res) {
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
      const { projectId, userId, title, message, type, data } = req.body;

      const notificationId = await notificationService.createNotification({
        projectId,
        userId,
        title,
        message,
        type,
        data,
      });

      res.status(201).json({
        message: "Notification created successfully",
        notificationId,
      });
    } catch (error) {
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
