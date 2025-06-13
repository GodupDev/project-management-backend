import mongoose from "mongoose";
import Collection from "../../config/collection.js";
import Enum from "../../config/enums.js";
const taskSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: Collection.main.PROJECTS,
      required: [true, "Project ID is required"],
    },
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
    taskAttchment: {
      type: String,
      default: "",
    },
    
    taskStartDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    taskEndDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    
    taskAssign: [
      {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: Collection.main.PROJECT_MEMBERS,
        type: String,
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
  if (this.taskEndDate < this.taskStartDate) {
    return next(
      new Error("End date must be greater than or equal to start date"),
    );
  }
  next();
});

const taskModel = mongoose.model(Collection.main.TASKS, taskSchema);
export default taskModel;

