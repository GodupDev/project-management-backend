import mongoose from "mongoose";
import Collection from "../../config/collection.js";
import Enum from "../../config/enums.js";

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
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
    status: {
      type: String,
      enum: Enum.PROJECT_STATUS,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Custom validation: endDate phải lớn hơn hoặc bằng startDate
projectSchema.pre("save", function (next) {
  if (this.dateRange.endDate >= this.dateRange.startDate) {
    return next(
      new Error("End date must be greater than or equal to start date"),
    );
  }
  next();
});

const ProjectModel = mongoose.model(
  Collection.main.PROJECTS,
  projectSchema,
);
export default ProjectModel;