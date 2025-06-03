import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
import Enum from "../../config/enums.config.js";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: Enum.ROLE_NAME,
  },
  description: {
    type: String,
    default: "",
  },
});

const Role = mongoose.model(Collection.auth.ROLE, roleSchema);
export default Role;
