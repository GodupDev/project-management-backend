import express from "express";
import authRoutes from "./auth.routes.js";
import userProfileRoutes from "./userProfile.routes.js";
import projectRoutes from "./project.routes.js";
import NotificationRoute from "./notification.routes.js";

const router = express.Router();

// Routes
router.use("/users", authRoutes);
router.use("/profiles", userProfileRoutes); // Đảm bảo route này được đăng ký
router.use("/projects", projectRoutes);
router.use("/notifications", NotificationRoute);

export default router;
