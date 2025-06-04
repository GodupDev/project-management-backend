import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const timelogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.PROJECT_MEMBERS },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: Collection.main.TASKS },
  duration: Number,
  description: String,
  loggedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const TimelogModel = mongoose.model(Collection.supporting.TIME_LOG, timelogSchema);
export default TimelogModel;
