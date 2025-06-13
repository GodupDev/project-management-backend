import express from "express";
import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
const UserRoute = express.Router()
UserRoute.get('/' , userController.getAllUsers)
UserRoute.get('/:id', userController.getUserById);
export default UserRoute;