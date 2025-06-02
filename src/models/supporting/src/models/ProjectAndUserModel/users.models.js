import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Collection from "../../config/collection.js";

// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role_id: {
      type: Number, // Foreign key (e.g., 1: Admin, 2: User)
      required: true,
    },
    deviceToken: {
    type: String,
    default: null,
    }

  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UsersModel = mongoose.model(Collection.main.USERS, userSchema);
export default UsersModel;
