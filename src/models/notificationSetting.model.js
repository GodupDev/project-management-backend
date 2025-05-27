import mongoose from "mongoose";
import Collection from "../config/collection.js";

const notificationSettingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      unique: true
    },
    email: {
      dailyDigest: { type: Boolean, default: true },
      taskUpdates: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
    },
    push: {
      taskUpdates: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
    },
    desktop: {
      taskUpdates: { type: Boolean, default: true },
      projectUpdates: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
    }
  },
  { timestamps: true }
);

const NotificationSetting = mongoose.model("notification_settings", notificationSettingSchema);
export default NotificationSetting;