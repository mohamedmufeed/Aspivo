import mongoose, {  Schema, Types } from "mongoose";

import { ObjectId } from "mongodb";

export interface IUser {
  _id: ObjectId;
  userName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email: string;
  password?: string;
  location?: string;
  position?: string;
  isAdmin: boolean;
  about?: string;
  verified: boolean;
  experiences: Experience[];
  education:Education[];
  skills: string[];
  profileImage: string;
  resume: string;
  isBlocked: boolean;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
  customerId?: string;
  subscription?: {
    subscriptionId?: string;
    status?: string;
    plan?: string;
  };
  chatLimit:number
  features: {
    unlockAiFeatures: boolean;
    unlimitedChat: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  _id: Types.ObjectId;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  grade: string;
}

export interface Experience {
  _id: Types.ObjectId;
  title: string;
  company: string;
  startDate: Date;
  endDate: Date|null;
  employmentType: "Full time" | "Part time" | "Remote" | "Intern" | "Contract";
  location: string;
  description: string;
  currentlyWorking: boolean;
}

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
      required: false,
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
      default: [],
    },
    profileImage: {
      type: String,
      default: " ",
    },
    resume: {
      type: String,
      default: "",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    googleId: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    customerId: { type: String },
    subscription: {
      subscriptionId: { type: String },
      status: { type: String },
      plan: { type: String },
    },
    features: {
      unlockAiFeatures: { type: Boolean, default: false },
      unlimitedChat: { type: Boolean, default: false },
    },
    chatLimit: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);
export type UserDocument = IUser & Document;
const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
