import express from "express";
import TaskRoute from "./task.route.js";
import AuthRoute from "./auth.routes.js";
const route = express.Router();

route.use("/tasks", TaskRoute);
route.use("/users", AuthRoute);

export default route;
