import express from "express";
import userProfileController from "../controllers/userProfile.controller.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

// Get user profile
router.get("/:userId", protect, userProfileController.getUserProfile);

// Create or update user profile
router.put("/", protect, userProfileController.updateUserProfile);

export default router;
