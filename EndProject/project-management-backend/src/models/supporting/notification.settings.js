import mongoose from "mongoose";
import Collection from "../config/collection.js";


const notificationOptionSchema = new mongoose.Schema({
  dailyDigest: { type: Boolean, default: true },
  taskUpdates: { type: Boolean, default: true },
  projectUpdates: { type: Boolean, default: true },
  mentions: { type: Boolean, default: true },
  comments: { type: Boolean, default: true },
}, { _id: false }); // _id: false để tránh sinh _id phụ cho mỗi loại notification

const notificationSettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Collection.main.USERS,
    required: true,
    unique: true, // Mỗi user 1 bộ settings riêng
  },
  emailNotifications: {
    type: notificationOptionSchema,
    default: () => ({}),
  },
  pushNotifications: {
    type: notificationOptionSchema,
    default: () => ({}),
  },
  desktopNotifications: {
    type: notificationOptionSchema,
    default: () => ({}),
  },
}, {
  timestamps: true
});

const NotificationSetting = mongoose.model("notification_settings", notificationSettingSchema);
export default NotificationSetting;