import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";

const rolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.auth.ROLE,
      required: true,
      index: true,
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.auth.PERMISSION,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// index phức hợp để đảm bảo mỗi quyền chỉ được gán một lần cho một vai trò
rolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

const RolePermission = mongoose.model(
  Collection.auth.ROLE_PERMISSION,
  rolePermissionSchema,
);
export default RolePermission;
