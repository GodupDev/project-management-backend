import mongoose from "mongoose";
import Collection from "../../config/collection.js";
import Enum from "../../config/enums.js";
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
    dateRange: {
      startDate: {
        type: Date,
        required: [true, "Start date is required"],
      },
      endDate: {
        type: Date,
        required: [true, "End date is required"],
      },
    },
    taskAssign: [
      {
        type: String,
        ref: Collection.main.PROJECT_MEMBERS,
        required: true,
      },
    ],
    taskStatus: {
      type: String,
      enum: Enum.TASK_STATUS,
      required: true,
      default: Enum.TASK_STATUS.TODO,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.pre("save", function (next) {
  if (this.dateRange.endDate >= this.dateRange.startDate) {
    return next(
      new Error("End date must be greater than or equal to start date"),
    );
  }
  next();
});

const taskModel = mongoose.model(Collection.main.TASKS, taskSchema);
export default taskModel;

