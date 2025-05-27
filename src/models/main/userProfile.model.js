import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const projectMemberSchema = new Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.main.PROJECTS,
      required: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // FK
      ref: Collection.main.USERS,
      required: true,
      index: true,
    },
    role_id: {
      //   type: mongoose.Schema.Types.ObjectId,
      //   ref: Collection.auth.ROLE,
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

projectMemberSchema.index({ project_id: 1, user_id: 1 }, { unique: true });

const projectMemberModel = mongoose.model(
  Collection.main.PROJECT_MEMBERS,
  projectMemberSchema,
);
export default projectMemberModel;
