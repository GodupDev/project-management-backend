import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const projectMemberSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.MAIN_COLLECTIONS.PROJECTS,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.MAIN_COLLECTIONS.USERS,
      required: true,
      index: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.AUTH_COLLECTIONS.ROLE,
      required: true,
      index: true,
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
  Collection.MAIN_COLLECTIONS.PROJECT_MEMBERS,
  projectMemberSchema,
);
export default projectMemberModel;
