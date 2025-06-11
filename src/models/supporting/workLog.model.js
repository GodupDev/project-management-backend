const mongoose = require("mongoose");
import Collection from "../../config/collection.js";

const workLogSchema = new mongoose.Schema(
  {
    action: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.PROJECT_MEMBERS,
    },
    targetType: String,
    targetId: { type: mongoose.Schema.Types.ObjectId },
    description: String,
  },
  { timestamps: true },
);

const WorkLogModel = mongoose.model(
  Collection.supporting.WORK_LOG,
  workLogSchema,
);
export default WorkLogModel;
