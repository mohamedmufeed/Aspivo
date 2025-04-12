import mongoose, { Schema } from "mongoose";

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

const Company = mongoose.model("Company", companySchema);
export default Company;
