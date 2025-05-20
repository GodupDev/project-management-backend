import mongoose from "mongoose";
import Collection from "../config/collection.js";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["Leader", "Staff"], 
      // enum: ["Leader", "Staff", "Admin", "PM", "Dev", "Tester", "Viewer"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Role = mongoose.model(Collection.auth.ROLE, roleSchema);
export default Role;