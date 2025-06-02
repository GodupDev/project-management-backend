import express from "express";
import * as performanceController from "../../controllers/Performance/performance.controller.js";
import { protect } from "../../middlewares/Authentication/auth.mdw.js";

const router = express.Router();

router.get("/overview", protect, performanceController.getOverview);
router.get("/projects", protect, performanceController.getPerformanceByProjects);
router.get("/users", protect, performanceController.getPerformanceByUsers);
router.get("/tasks", protect, performanceController.getPerformanceByTasks);
router.get("/metrics", protect, performanceController.getMetrics);
router.get("/trends", protect, performanceController.getTrends);

export default router;
