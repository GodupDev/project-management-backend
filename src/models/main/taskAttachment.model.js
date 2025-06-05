import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
const taskAttachmentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.TASKS,
      required: true,
    },
    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.TASK_COMMENTS,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    storageProvider: {
      type: String,
      default: "local",
    },
  },
  {
    timestamps: true,
  },
);
const taskAttachmentModel = mongoose.Model(
  Collection.main.TASK_ATTATCHMENT,
  taskAttachmentSchema,
);
export default taskAttachmentModel;
