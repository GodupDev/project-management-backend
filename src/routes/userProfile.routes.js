import express from "express";
import { protect } from "../middlewares/auth.mdw.js";
import userProfileController from "../controllers/userProfile.controller.js";

const router = express.Router();

// Get user profile
router.get("/:userId", protect, userProfileController.getUserProfile);

// Create or update user profile
router.put("/", protect, userProfileController.updateUserProfile);

// Update notification settings
router.put("/notification-settings", protect, userProfileController.updateNotificationSettings);

export default router;
