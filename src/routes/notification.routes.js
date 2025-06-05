import express from "express";
import NotificationController from "../controllers/notification.controllers.js";
import { protect, checkRoleAndPermission } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Project routes
router.post("/", protect, NotificationController.addNotification);
router.get("/", protect, NotificationController.getNotifications);
router.delete("/:id", protect, NotificationController.deleteNotification);
router.put("/:id/read", protect, NotificationController.markNotificationAsRead);

// Export the router
export default router;
