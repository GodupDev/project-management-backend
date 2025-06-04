import express from "express";
import AuthRoute from "./auth.routes.js";
import PermissionRoute from "./permission.routes.js";
import RolePermissionRoute from "./rolePermission.routes.js";

const route = express.Router();

route.use("/users", AuthRoute);
route.use("/permissions", PermissionRoute);
route.use("/role-permissions", RolePermissionRoute);

export default route;
