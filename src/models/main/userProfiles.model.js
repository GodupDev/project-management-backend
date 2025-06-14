import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    bestPosition: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      github: String,
      website: String,
    },
    // Thêm cấu trúc cài đặt thông báo
    notificationSettings: {
      emailNotifications: {
        taskUpdates: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        dailyDigest: { type: Boolean, default: false },
        weeklyReport: { type: Boolean, default: true },
      },
      pushNotifications: {
        taskUpdates: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: false },
        mentions: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
      },
      inAppNotifications: {
        taskUpdates: { type: Boolean, default: true },
        projectUpdates: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        systemUpdates: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model(
  Collection.main.USERS_PROFILE,
  userProfileSchema
);

export default UserProfile;
