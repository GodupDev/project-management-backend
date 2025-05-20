import mongoose from "mongoose";
const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum:["Leader", "Staff"]
      // enum: ["Leader", "Staff", "Admin", "PM", "Dev", "Tester", "Viewer"],
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;