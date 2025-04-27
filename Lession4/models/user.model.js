import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;