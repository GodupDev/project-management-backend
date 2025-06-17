import express from "express";
import { taskController } from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.mdw.js";

const TaskRoute = express.Router();

// Task routes
TaskRoute.get("/", protect, taskController.getAllTask);
TaskRoute.get("/user/:userId", protect, taskController.getTasksByUserId);
TaskRoute.get("/:id", protect, taskController.getTask);
TaskRoute.post("/", protect, taskController.createTask);
TaskRoute.patch("/:id", protect, taskController.updateTask);
TaskRoute.delete("/:id", protect, taskController.deleteTask);

export default TaskRoute;
