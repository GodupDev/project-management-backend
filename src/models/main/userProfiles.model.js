import mongoose from "mongoose";
import Collection from "../../config/collection.js";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    summary: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

const UserProfileModel = mongoose.model(
  Collection.main.USER_PROFILES,
  userProfileSchema,
);
export default UserProfileModel;
