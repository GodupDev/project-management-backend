import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";
import Enum from "../../config/enums.config.js";

const allPermissions = [
  ...Enum.PERMISSION_CODE.LEADER,
  ...Enum.PERMISSION_CODE.STAFF,
];

const permissionSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: allPermissions,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Permission = mongoose.model(Collection.auth.PERMISSION, permissionSchema);
export default Permission;
