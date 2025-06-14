import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
const taskCommentSchema = mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.TASKS,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      
    },
    content: {
      type: String,
      required: true,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Collection.main.PROJECT_MEMBERS,
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.TASK_COMMENTS,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const taskCommentModel = mongoose.model(
  Collection.main.TASK_COMMENTS,
  taskCommentSchema,
);
export default taskCommentModel;
