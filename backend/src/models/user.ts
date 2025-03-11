import mongoose, { Schema } from "mongoose";
import { title } from "process";
import { start } from "repl";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    firstName: { type: String, required: false },

    lastName: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
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
    experiences: [
      {
        title: {
          type: String,
          required: false,
        },
        company: {
          type: String,
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
        employmentType: {
          type: String,
          enum: ["Full time", "Part time", "Remote", "Intern", "Contract"],
          required: false,
        },
        location: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
        currentlyWorking: {
          type: Boolean,
          required: false,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: false,
        },
        degree: {
          type: String,
          required: false,
        },
        fieldOfStudy: {
          type: String,
          required: false,
        },
        startDate: {
          type: Date,
          required: false,
        },
        endDate: {
          type: Date,
          required: false,
        },
        grade: {
          type: String,
          required: false,
        },
      },
    ],
    skills: {
      type: [String], 
      required: false,
    },
    profileImage: {
      type: String,
      default: "https://yourcdn.com/default-avatar.png",
    },
    isBlocked: {
      type: Boolean,
      default: false,
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
