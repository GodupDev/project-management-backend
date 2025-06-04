import express from "express";
import { protect } from "../middlewares/auth.mdw.js";
import * as notificationController from "../controllers/notification.controller.js";

const router = express.Router();

// Lấy tất cả notification của user
router.get("/", protect, notificationController.getMyNotifications);

// Đánh dấu 1 notification là đã đọc
router.patch("/read/:id", protect, notificationController.markAsRead);

// Đánh dấu tất cả đã đọc
router.put("/read-all", protect, notificationController.markAllAsRead);

// Xoá 1 notification
router.delete("/:id", protect, notificationController.deleteNotification);

// (Tuỳ chọn) Tạo notification thủ công (dùng cho test/admin)
router.post("/", protect, notificationController.createNotificationManual);

export default router;
