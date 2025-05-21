import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.PROJECT_MEMBERS },
  message: String,
  type: String,
  isRead: { type: Boolean, default: false },
  link: String,
}, { timestamps: true });

const NotificationModel = mongoose.model(Collection.supporting.NOTIFICATION, notificationSchema);
export default NotificationModel;
