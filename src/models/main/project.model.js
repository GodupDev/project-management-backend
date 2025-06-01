import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const projectSchema = new Schema(
  {
    name_project: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    Date_Range: {
      start_date: {
        type: Date,
        required: true,
      },
      end_date: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
    },
    create_by: {
      type: Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const projectModel = mongoose.model(Collection.main.PROJECTS, projectSchema);
export default projectModel;
