
import { User } from "./userTypes";
import { Types } from "mongoose";
import { ObjectId } from "mongodb";
import { Education, Experience, IUser } from "../models/user";
import { ICompany } from "../models/company";
import { IJobApplication } from "../models/jobApplication";
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


export interface Company {
  _id: ObjectId;
  companyName: string;
  email: string;
  password: string;
  kyc: string;
  userId: ObjectId;
  verified: boolean;
  stack: string[];
  logo: string;
  contact: string[];
  createdAt: Date;
  updatedAt: Date;
  status: "Pending" | "Approved" | "Declined";
  features: {
    accessToAnalytics: boolean;
    unlimitedJobPosting: boolean;
  };
}


export interface IComapny {
  logo?: string;
  companyName: string;
  companyUrl: string;
  industry: string;
  startDate: Date;
  employees: string;
  location: string;
  stack?: string[];
}

export interface TeamMember {
  _id?: string;
  position: string;
  name: string;
}
export interface Contact {
  _id?: string;
  name: string;
  url: string;
}
export interface IMeetingData {
  roomId: string;
  peerId: string;
  startTime: string;
  initiatorId: Types.ObjectId;
  targetId: Types.ObjectId;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AppliedJobWithPopulatedData = {
  _id: string;
  userId: string;
  jobId: {
    _id: string;
    jobTitle: string;
    maximumSalary: number;
    minimumSalary: number;
    location: string;
    typesOfEmployment: string[];
    company: {
      _id: string;
      companyName: string;
      logo: string;
      location: string;
    };
  };
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedAt: Date;
};



export type SenderInfo =
  | { type: "user"; data: IUser }
  | { type: "company"; data: ICompany }
  | null;


export interface IMostAppliedJobs {
  _id: string;
  count: number;
  jobTitle: string;
  startDate: string
}

export interface IComapnyRequest {
  _id: string,
  status: "Pending" | "Approved" | "Declined"
}
export interface IcomapnyBlock {
  _id: string,
  isBlocked: boolean
}
export interface IUserBlockDto {
  _id: string,
  isBlocked: boolean
}


export interface ISubscriptionStatusDto {
  _id: string,
  status: string
} 
export interface JobDto {
  _id: string;
  jobTitle: string
  isActive: boolean,
  startDate: Date;
  endDate: Date;
  typesOfEmployment: string[]
}
export interface GetJobResponse {
  jobs: JobDto[];
  totalJobs: number;
  totalPages: number;
}


export interface IJobStatusDto{
_id:string,
status:boolean| undefined
}


interface IApplicationUserDto{
    profileImage:string;
    firstName:string;
    lastName:string;
}
interface IApplicationJobDto{
    jobTitle:string
}

 export interface IJobApplicationDto{
    _id:string;
    status:string;
    appliedAt:Date;
    user:IApplicationUserDto
    job:IApplicationJobDto

 }

export interface IApplicationJObDto{

}


  export interface IJobApplicationDetailsDto{
    _id:string;
    appliedAt:Date,
    status:string
    jobId:{
      jobTitle:string,
      typesOfEmployment:string[],
      company:string
    },
    userId:{
      _id:string
      email:string;
      profileImage:string
      experiences:Experience[],
      firstName:string,
      lastName:string;
      education:Education[];
      phoneNumber:string;
      resume:string;
      skills:string[]
    }
  }