import express from "express";
import authRoutes from "./auth.routes.js";
import userProfileRoutes from "./userProfile.routes.js";
import projectRoutes from "./project.routes.js";
import NotificationRoute from "./notification.routes.js";
import TaskRoute from "./task.routes.js";

const router = express.Router();

route.use("/users", AuthRoute);
route.use("/projects", ProjectRoute);
route.use("/profiles", UserProfileRoute);
route.use("/notifications", NotificationRoute);
route.use("/tasks", TaskRoute);

export default router;
