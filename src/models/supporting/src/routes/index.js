import express from "express";
import tagRoutes from "./Supporting/tagRoutes.js";
import notificationSettingRoutes from "./Supporting/notificationSettingRoutes.js";
import auditLogRoutes from "./Supporting/auditLogRoutes.js";
import labelRoutes from "./Supporting/labelRoutes.js";
import notificationRoutes from "./Supporting/notificationRoutes.js";
import timeLogRoutes from "./Supporting/timeLogRoutes.js";
import AuthRoute from "./Authen/auth.routes.js";

const router = express.Router();

// AUthen API
router.use("/api/auth", AuthRoute);
// Supporting API
router.use("/api", tagRoutes);
router.use ("/api", notificationSettingRoutes);
router.use("/api", auditLogRoutes);
router.use("/api", labelRoutes);
router.use("/api", notificationRoutes);
router.use("/api", timeLogRoutes);


export default router;
