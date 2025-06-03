import express from "express";
import notificationController from "../controllers/notification.controller.js";

const router = express.Router();

// Get real-time notifications for a project
router.get(
  "/project/:projectId",
  notificationController.getProjectNotifications,
);

// Get notifications list for a project (non-realtime)
router.get(
  "/project/:projectId/list",
  notificationController.getProjectNotificationsList,
);

// Mark a notification as read
router.patch("/:notificationId/read", notificationController.markAsRead);

// Mark all notifications as read for a project
router.patch(
  "/project/:projectId/read-all",
  notificationController.markAllAsRead,
);

export default router;
