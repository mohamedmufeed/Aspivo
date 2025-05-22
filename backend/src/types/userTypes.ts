import { ObjectId } from "mongodb";
import { Experience, IUser } from "../models/user";
import {  ICompany } from "../models/company";
import { ISubscription as ISubscriptionType } from "../models/Subscription";
import { IJob } from "../models/job";
import { ISkill } from "../models/skills";
import { IJobApplication } from "../models/jobApplication";
export interface ProfileTypes {
  profileImage: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  location: string;
}
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

// export interface Experience {
//   title: string;
//   company: string;
//   startDate: Date;
//   endDate: Date|null;
//   employmentType: "Full time" | "Part time" | "Remote" | "Intern" | "Contract";
//   location: string;
//   description: string;
//   currentlyWorking: boolean;
// }

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  grade: string;
}



export interface SkillItem {
  name: string;
  _id: ObjectId;
  createdAt: Date;
}
export type SkillItemList = SkillItem[];


export interface ISubscription extends Document {
  userId: string;
  companyId?:string;
  subscriptionId: string;
  plan: string;
  amount: number;
  status: string;
}

export interface GetPaginationQuery {
  page: number;
  limit: number;
  searchQuery: string;
}


export interface GetUsersResponse {
  users: IUser[];
  totalUsers: number;
  totalPages: number;
}
export interface GetSkillResponse {
  skills: ISkill[];
  totalSkills: number;
  totalPages: number;
}
export interface GetJobResponse {
  jobs: IJob[];
  totalJobs: number;
  totalPages: number;
}
export interface GetJobApplicationResponse {
  applications: IJobApplication[];
  totalApplications: number;
  totalPages: number;
}

export interface GetUsersDtoResponse{
    users: IMappedUserDto[];
  totalUsers: number;
  totalPages: number;
}

export interface GetCompanyResponse{
  companies:ICompany[]
  totalRequest: number;
  totalPages: number;
}
export interface GetCompanyDtoResponse{
  companies:IMppaedCompany[]
  totalRequest: number;
  totalPages: number;
}
 export interface GetApprovedCompanyResponse{
  company:ICompany[]
  totalCompany:number
  totalPages:number
 }
 export interface GetApprovedCompanyDtoResponse{
  company:IMppaedCompany[]
  totalCompany:number
  totalPages:number
 }

 export interface GetSubscriptionResponse{
  subscription:ISubscriptionType[]
  totalSubscription:number
  totalPages:number
 }
  export interface IReviewData{
     userId:string;
     review:string
 }


 export interface IMappedUserDto{
  _id:string;
  profileImage:string;
  email:string,
  userName:string,
  createdAt:string;
  isBlocked:boolean
 }


  export interface IMppaedCompany{
     _id:string;
    companyName:string;
    email:string;
    status:string;
    createdAt:string;
    kyc:string,
    isBlocked:boolean
  }
  export interface IMappedSubscription{
     _id: string;
    user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    companyId: string;
    subscriptionId: string;
    plan: string;
    amount: number;
    status: "active" | "inactive" | "cancelled";
    createdAt: string;
    updatedAt: string;
  }


export interface UserWithPopulatedJobs extends User {
  savedJobs: {
    jobId: IJob & {
      company: ICompany;
    };
  }[];
}


export interface PopulatedSavedJob {
  jobId: IJob & { company: ICompany };
}
