import mongoose from "mongoose";
import { User } from "./userTypes";
export interface JobData {
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
  company?: string;
}

type ApplicationStatus = "pending" | "approved" | "rejected";

interface Education {
  degree: string;
  school: string;
  startDate: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface Job {
  _id: string;
  jobTitle: string;
  typesOfEmployment: string;
}

export interface JobApplication {
  _id: string;
  jobId: Job;
  userId: User;
  status: ApplicationStatus;
  appliedAt: string;
  __v: number;
}

import { ObjectId } from "mongodb";

export interface Company {
  _id: ObjectId;
  companyName: string;
  email: string;
  password: string;
  kyc: string;
  userId: ObjectId;
  verified: boolean;
  stack: string[];
  contact: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "Approved" | "Pending" | "Rejected";
  features: {
    accessToAnalytics: boolean;
    unlimitedJobPosting: boolean;
  };
}


export interface IComapny{
  logo?:string;
  companyName: string;
  companyUrl: string;
  industry: string;
  startDate:Date;
  employees:string;
  location: string;  
  stack?: string[];
}