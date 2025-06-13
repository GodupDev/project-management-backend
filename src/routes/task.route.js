import express from "express";
import { Router } from "express";
import { taskController } from "../controllers/task.controller.js";
const TaskRoute = express.Router()
TaskRoute.get('/' , taskController.getAllTask)
TaskRoute.get('/project/:projectId', taskController.getTasksByProjectId);
TaskRoute.get('/user/:userId', taskController.getTasksByUserId);
TaskRoute.get('/:id', taskController.getTask);
TaskRoute.post('/', taskController.createTask);
TaskRoute.patch('/:id', taskController.updateTask)
TaskRoute.delete('/:id', taskController.deleteTask)
export default TaskRoute;