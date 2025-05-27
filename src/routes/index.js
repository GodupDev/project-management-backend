import express from "express";
import { Router } from "express";
import  TaskRoute  from "./task.route.js";
import CommentRoute from "./comment.route.js";
const mainRoute = express.Router()
mainRoute.use('/tasks', TaskRoute)
mainRoute.use('/comments', CommentRoute)
export default mainRoute;