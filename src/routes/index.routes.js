import express from "express";
import AuthRoute from "./auth.routes.js";
import  TaskRoute  from "./task.route.js";
import CommentRoute from "./comment.route.js";
import AttachmentRoute from "./attachment.route.js";
import ProjectRoute from "./project.route.js";


const mainRoute = express.Router()
mainRoute.use("/users", AuthRoute);
mainRoute.use('/tasks', TaskRoute)
mainRoute.use('/comments', CommentRoute)
mainRoute.use('/attachments', AttachmentRoute)
mainRoute.use('/projects', ProjectRoute)


export default mainRoute;
