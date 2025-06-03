import express from "express";
import AuthRoute from "./auth.routes.js";
import ProjectRoute from "./project.routes.js";

const route = express.Router();

route.use("/users", AuthRoute);
route.use("/projects", ProjectRoute);

export default route;
