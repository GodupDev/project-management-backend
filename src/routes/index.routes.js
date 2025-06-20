import express from "express";

import AuthRoute from "./auth.routes.js";
import ProjectRoute from "./project.routes.js";
import UserProfileRoute from "./userProfile.routes.js";
import NotificationRoute from "./notification.routes.js";
import TaskRoute from "./task.routes.js";

const route = express.Router();

route.use("/users", AuthRoute);
route.use("/projects", ProjectRoute);
route.use("/profiles", UserProfileRoute);
route.use("/notifications", NotificationRoute);
route.use("/tasks", TaskRoute);

export default route;
