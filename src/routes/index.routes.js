import express from "express";
import AuthRoute from "./auth.routes.js";
const route = express.Router();

route.use("/users", AuthRoute);

export default route;
