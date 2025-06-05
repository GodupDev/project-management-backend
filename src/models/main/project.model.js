import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
import Enum from "../../config/enums.config.js";

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
        default: () => new Date(), // Correct way to set today's date as default
      },
      endDate: {
        type: Date,
      },
    },
    status: {
      type: String,
      enum: Enum.PROJECT_STATUS,
      default: Enum.PROJECT_STATUS.ACTIVE,
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

projectSchema.statics.findByIdAndUpdateProject = function (id, updateData) {
  return this.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

const ProjectModel = mongoose.model(Collection.main.PROJECTS, projectSchema);
export default ProjectModel;
