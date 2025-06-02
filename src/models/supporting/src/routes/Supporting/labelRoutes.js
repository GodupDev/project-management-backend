import express from "express";
import {
  createLabel,
  getAllLabels,
  getLabelById,
  updateLabel,
  deleteLabel
} from "../controllers/label.controller.js";

const router = express.Router();

router.post("/labels", createLabel);
router.get("/labels", getAllLabels);
router.get("/labels/:id", getLabelById);
router.put("/labels/:id", updateLabel);
router.delete("/labels/:id", deleteLabel);

export default router;
