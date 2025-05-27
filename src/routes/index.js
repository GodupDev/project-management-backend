import express from "express";
import { Router } from "express";
import  TaskRoute  from "./task.route.js";
const mainRoute = express.Router()
mainRoute.use('/tasks', TaskRoute)
export default mainRoute;