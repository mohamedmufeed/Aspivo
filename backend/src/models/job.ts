import mongoose, { Schema } from "mongoose";

export interface IJob extends Document {
  jobTitle: string;
  category: string;
  typesOfEmployment: string[];
  maximumSalary: number;
  minimumSalary: number;
  qualification: string;
  requiredSkills: string[];
  jobResponsibilities: string;
  startDate: Date;
  endDate: Date;
  slot: number;
  requirements: string;
  jobDescription: string;
  company: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema({
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    typesOfEmployment: {
      type: [String],
      enum: ["Full-time", "Part-time", "Remote", "Internship", "Contract"],
      required: true,
    },
    maximumSalary: {
      type: Number,
      required: true,
    },
    minimumSalary: {
      type: Number,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
      trim: true,
    },
    requiredSkills: {
      type: [String],
      required: true,
    },
    jobResponsibilities: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    slot: {
      type: Number,
      required: true,
      min: 1,
    },
    requirements: {
      type: String,
      required: true,
      trim: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },{
    timestamps:true
  });
  

const Job= mongoose.model<IJob & Document>("Job",jobSchema) 
export default Job
