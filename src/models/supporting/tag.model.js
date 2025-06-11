import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const tagSchema = new mongoose.Schema({
  name: String,
  color: String,
}, { timestamps: true });

const TagModel = mongoose.model(Collection.supporting.TAG, tagSchema);
export default TagModel;
