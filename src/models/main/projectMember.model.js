import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const { Schema } = mongoose;

const projectMemberSchema = new Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.PROJECTS,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      index: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.auth.ROLE,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure each user only has one role per project
projectMemberSchema.index(
  { project: 1, user: 1 },
  { unique: true }
);

const ProjectMember = mongoose.model(
  Collection.main.PROJECT_MEMBERS,
  projectMemberSchema
);
export default ProjectMember;