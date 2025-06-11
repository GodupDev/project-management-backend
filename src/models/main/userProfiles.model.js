import mongoose from "mongoose";
import Collection from "../../config/collection.config.js";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Collection.main.USERS,
      required: true,
      unique: true,
      index: true, // tăng tốc truy vấn
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    bestPosition: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    contactNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          // Regex cơ bản, có thể thay theo yêu cầu từng quốc gia
          return !v || /^[0-9\-\+\s]{9,15}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    avatarUrl: {
      type: String,
      trim: true,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      validate: {
        validator: function (v) {
          // Kiểm tra URL bắt đầu bằng http hoặc https
          return /^https?:\/\/.+/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    bio: {
      type: String,
      maxLength: [300, "About cannot be more than 300 characters"],
      default: "",
      trim: true,
    },
    // Mạng xã hội (có thể là object chứa link Facebook, LinkedIn...)
    socialLinks: {
      facebook: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      github: { type: String, trim: true, default: "" },
      // thêm các mạng xã hội khác nếu muốn
    },
  },
  {
    timestamps: true,
  },
);

// Tạo model từ schema
const UserProfileModel = mongoose.model(
  Collection.main.USERS_PROFILE,
  userProfileSchema,
);

export default UserProfileModel;
