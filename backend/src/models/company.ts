import mongoose, { HydratedDocument, model, Model, Schema } from "mongoose";
import { Company } from "../types/companyTypes";
import { ObjectId } from "mongodb";

export interface ICompany {
  _id: ObjectId;
  companyName: string;
  email: string;
  location?: string;
  description?: string;
  companyUrl?: string|undefined;
  logo: string;
  kyc: string;
  userId: ObjectId;
  status: "Pending" | "Approved" | "Declined";
  stack: string[];
  startDate?: Date;
  industry?: string;
  contact: {
    name?: string;
    url?: string;
  }[];
  employees?: string;
  customerId?: string;
  subscription?: {
    subscriptionId?: string;
    status?: string;
    plan?: string;
  };
  features: {
    unlimitedJobPosting: boolean;
    accessToAnalytics: boolean;
  };
  jobLimit:number,
  team: {
    position: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyDocument = HydratedDocument<ICompany>;
const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    companyUrl: {
      type: String,
      required: false,
    },
    logo: {
      type: String,
      required: false,
      default: ''
    },
    kyc: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    status: { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" },
    stack: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    startDate: {
      type: Date,
      required: false,
    },
    industry: {
      type: String,
      required: false,
    },
    contact: [
      {
        name: { type: String, required: false , trim:true },
        url: { type: String, required: false,trim:true  },
      },
    ],
    employees: {
      type: String,
      required: false,
    },
    customerId: { type: String }, 
    subscription: {
      subscriptionId: { type: String },
      status: { type: String },
      plan: { type: String },
    },
    features: {
      unlimitedJobPosting: { type: Boolean, default: false },
      accessToAnalytics: { type: Boolean, default: false },
    },
    jobLimit:{
type:Number,
default:5
    },
    team: [
      {
        position: {
          type: String,
          required: true,
          trim: true,
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = model<ICompany, mongoose.Model<CompanyDocument>>("Company", companySchema);
export default Company;
