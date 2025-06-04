import express from "express";
import notificationController from "../controllers/notification.controller.js";

const router = express.Router();

// Get notifications for a project
router.get(
  "/project/:projectId",
  notificationController.getProjectNotifications,
);

// Create a new notification
router.post("/", notificationController.createNotification);

// Mark a notification as read
router.patch("/:notificationId/read", notificationController.markAsRead);

// Mark all notifications as read for a project
router.patch(
  "/project/:projectId/read-all",
  notificationController.markAllAsRead,
);

export default router;
