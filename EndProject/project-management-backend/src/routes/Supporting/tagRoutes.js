import express from "express";
import {
  getAllTags,
  createTag,
  getTagById,
  updateTag,
  deleteTag
} from "../controllers/TagController.js";

const router = express.Router();

router.get("/tags", getAllTags);
router.post("/tags", createTag);
router.get("/tags/:id", getTagById);
router.patch("/tags/:id", updateTag);
router.delete("/tags/:id", deleteTag);

export default router;
