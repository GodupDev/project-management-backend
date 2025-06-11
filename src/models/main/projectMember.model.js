import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";

const { Schema } = mongoose;

const projectMemberSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.main.PROJECTS,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.main.USERS,
      required: true,
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.auth.ROLE,
      index: true,
      default: "6833df5c354c96367f2bf5a4", //Staff
    },
  },
  {
    timestamps: true,
  },
);

projectMemberSchema.index(
  { projectId: 1, userId: 1, roleId: 1 },
  { unique: true },
);

const projectMemberModel = mongoose.model(
  Collection.main.PROJECT_MEMBERS,
  projectMemberSchema,
);
export default projectMemberModel;
