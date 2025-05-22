import {Types} from "mongoose"
import { ObjectId } from "mongodb";
interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string;
  phone: string;
  skills: string[];
}

interface PopulatedJob {
  _id: string;
  jobTitle: string;
}

export interface Application {
  _id: string;
  userId: string;
  user:PopulatedUser
  jobId: string;
  job:PopulatedJob;
  status: string;
  appliedAt: string;
}

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "accepted"
  | "rejected";

// interface Education {
//   degree: string;
//   school: string;
//   startDate: string;
// }

// interface Experience {
//   company: string;
//   position: string;
//   startDate: string;
//   endDate?: string;
//   description: string;
// }

export interface User {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  position: string;
  about: string;
  profileImage: string;
  resume: string;
  skills: string[];
  education: Education[];
  experiences: Experience[];
  createdAt: string;
  updatedAt: string;
  isAdmin: boolean;
  isBlocked: boolean;
  verified: boolean;
  password?: string;
}

interface Job {
  _id: string;
  jobTitle: string;
  company: string
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

export interface JobData {
  _id: string | undefined;
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
  isActive:boolean;
  company: {
    _id: string;
    companyName: string;
    logo?: string;
    location?: string;
    email?: string;
    description?:string

  };
}


export interface IComapny {
  companyName: string;
  companyUrl: string;
  industry: string;
  startDate: string;
  employees: string;
  location: string;
}
export interface TeamMember {
  position: string;
  name: string;
}
export interface Contact {
  name: string;
  url: string;
}

export interface IPopulatedCompany {
  _id?: string;
  companyName: string;
  companyUrl: string;
  email: string;
  employees: number;
  description: string;
  industry: string;
  location: string;
  stack: string[]
  logo: string;
  startDate: string;
  status: "Approved" | "Pending" | "Rejected";
  verified: boolean;
  subscription: {
    subscriptionId: string;
    status: "active" | "canceled" | "expired";
  };
  team: TeamMember[]
  contact: Contact[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface IMeetingData {
  _id?:string
  roomId: string;
  peerId: string;
  startTime: string; 
  initiatorId: string;
  targetId: string;
  link: string; 
}

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
  chatLimit:number,
  savedJobs:ISavedJobs[]
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


export interface ISavedJobs{
  jobId:string;
  savedAt:string
}

export interface ICompanyType {
  _id: ObjectId;
  companyName: string;
  email: string;
  location?: string;
  description?: string;
  companyUrl?: string;
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



