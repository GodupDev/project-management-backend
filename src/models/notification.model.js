import mongoose from "mongoose";
import Collection from "../config/collection.js";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["task_update", "project_update", "mention", "comment", "system"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Thêm trường điều khiển hiển thị thông báo
    deliveryChannels: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true }
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      // Có thể trỏ đến project, task, comment tùy theo type
    },
    referenceModel: {
      type: String,
      enum: ["Project", "Task", "Comment", "User"],
    },
  },
  { timestamps: true }
);

// Index để tìm kiếm hiệu quả
notificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model(Collection.supporting.NOTIFICATION, notificationSchema);
export default Notification;