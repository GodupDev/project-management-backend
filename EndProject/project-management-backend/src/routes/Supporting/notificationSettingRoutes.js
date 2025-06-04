import express from "express";
import { getNotificationSetting, updateNotificationSetting } from "../controllers/notificationSettingController.js";
import { protect } from "../../middlewares/Authentication/auth.mdw.js";

const router = express.Router();

router.get("/", protect, getNotificationSetting);
router.put("/", protect, updateNotificationSetting);

export default router;
// This code defines routes for managing user notification settings in an Express application.
// It includes routes to get and update notification settings, protected by authentication middleware.