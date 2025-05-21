import mongoose, { Document, Schema, Types } from "mongoose";

export interface IJobApplication extends Document {
  jobId: Types.ObjectId;        
  userId: Types.ObjectId;        
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: Date;
}


export interface PopulateIUser extends Document {
  name: string;
  email: string;
}

export interface PopulateIJob extends Document {
  jobTitle: string;
  typesOfEmployment: string[];
  company: Types.ObjectId;
}


const JobApplicationSchema = new Schema({
  jobId: {
    type: mongoose.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});

 export type JobApplicationDocument= IJobApplication & Document
const JobApplication= mongoose.model<JobApplicationDocument>("JObApplication",JobApplicationSchema)
export default JobApplication