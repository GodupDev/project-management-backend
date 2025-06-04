import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const labelSchema = new mongoose.Schema({
  name: String,
  color: String,
}, { timestamps: true });

const LabelModel = mongoose.model(Collection.supporting.LABEL, labelSchema);
export default LabelModel;
