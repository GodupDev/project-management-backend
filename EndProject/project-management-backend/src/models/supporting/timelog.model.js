import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const TimeLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.PROJECT_MEMBERS },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.TASKS },
  duration: Number,
  description: String,
  // loggedAt sẽ lưu chi tiết cả ngày, giờ, phút, giây
  loggedAt: { type: Date, default: () => new Date() },
}, { timestamps: true });

const TimeLog = mongoose.model(Collection.supporting.TIME_LOG, TimeLogSchema);
export default TimeLog;
