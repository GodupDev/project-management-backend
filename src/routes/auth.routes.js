import express from "express";
import AuthController from "../controllers/auth.controllers.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.mdw.js";
import { protect } from "../middlewares/auth.mdw.js";

const router = express.Router();

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.get("/me", protect, AuthController.getCurrentUser);
router.post("/signout", protect, AuthController.signout);
router.put("/change-password", protect, AuthController.changePassword);
router.get("/:email", AuthController.getUserByEmail);

export default router;
