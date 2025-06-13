import express from "express";

import AuthRoute from "./auth.routes.js";
import ProjectRoute from "./project.routes.js";
import UserProfileRoute from "./userProfile.routes.js";
import NotificationRoute from "./notification.routes.js";
import TaskRoute from "./task.route.js";
import CommentRoute from "./comment.route.js";
import AttachmentRoute from "./attachment.route.js";
import UserRoute from "./user.route.js";


const route = express.Router();

route.use("/users", AuthRoute);
route.use("/projects", ProjectRoute);
route.use("/profiles", UserProfileRoute);
route.use("/notifications", NotificationRoute);
route.use('/tasks', TaskRoute)
route.use('/comments', CommentRoute)
route.use('/attachments', AttachmentRoute)
route.use('/users', UserRoute)
export default route;
