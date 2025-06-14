import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
import Enum from "../../config/enums.config.js";


const notificationSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.PROJECTS,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(Enum.NOTIFICATION_TYPES),
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model(Collection.supporting.NOTIFICATION, notificationSchema);
