import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
const taskSchema = mongoose.Schema(
  {
    taskTitle: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
    },
    taskStartDate: {
      type: Date,
      required: true,
    },
    taskEndDate: {
      type: Date,
      required: true,
    },
    taskAssign: [
      {
        type: String,
        ref: Collection.main.PROJECT_MEMBERS,
        required: true,
      },
    ],
    taskTag: {
      type: String,
    },
    taskStatus: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);
const taskModel = mongoose.model(Collection.main.TASKS, taskSchema);
export default taskModel;
