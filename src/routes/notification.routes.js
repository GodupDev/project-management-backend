import express from "express";// API thêm cho thông báorouter.put("/read-all", markAllAsRead);router.delete("/read", deleteAllRead);// API cho cài đặt thông báorouter.get("/settings", getNotificationSettings);router.put("/settings", updateNotificationSettings);export default router;
import { protect } from "../middlewares/auth.mdw.js";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllAsRead,
  deleteAllRead,
  getNotificationSettings,
  updateNotificationSettings
} from "../controllers/notification.controller.js";

const router = express.Router();

// Tất cả routes thông báo yêu cầu đăng nhập
router.use(protect);

// Các API chính theo yêu cầu
router.get("/", getNotifications);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);

// API thêm cho thông báo
router.put("/read-all", markAllAsRead);
router.delete("/read", deleteAllRead);

// API cho cài đặt thông báo
router.get("/settings", getNotificationSettings);
router.put("/settings", updateNotificationSettings);

export default router;