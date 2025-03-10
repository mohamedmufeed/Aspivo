import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    firstName: { type: String, required: false },

    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: { type: String, required: false },
    position: { type: String, required: false },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "https://yourcdn.com/default-avatar.png",
    },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
