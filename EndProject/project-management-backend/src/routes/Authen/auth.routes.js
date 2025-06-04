import express from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../../controllers/Authentication/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../../middlewares/Authentication/validate.mdw.js";
import { protect } from "../../middlewares/Authentication/auth.mdw.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", protect, getCurrentUser);

export default router;