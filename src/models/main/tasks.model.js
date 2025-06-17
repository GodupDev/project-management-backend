import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
import Enum from "../../config/enums.config.js";
const taskSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.PROJECTS,
    },
    taskTitle: {
      type: String,
      required: true,
    },
    taskPriority: {
      type: String,
      enum: Enum.TASK_PRIORITY,
      default: Enum.TASK_PRIORITY.MEDIUM,
    },
    taskDescription: {
      type: String,
    },
    taskAttachment: {
      type: String,
      default: "",
    },

    taskStartDate: {
      type: Date,
    },
    taskEndDate: {
      type: Date,
    },

    taskAssign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Collection.main.PROJECT_MEMBERS,
      },
    ],
    taskStatus: {
      type: String,
      enum: Enum.TASK_STATUS,
      default: Enum.TASK_STATUS.TODO,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.pre("save", function (next) {
  if (this.taskEndDate < this.taskStartDate) {
    return next(
      new Error("End date must be greater than or equal to start date"),
    );
  }
  next();
});

const taskModel = mongoose.model(Collection.main.TASKS, taskSchema);
export default taskModel;
