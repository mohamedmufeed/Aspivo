import { SkillItemList, User } from "./userTypes";
import { Company, IMeetingData, JobApplication, JobData } from "./companyTypes";
import { IUser } from "../models/user";
import { ICompany } from "../models/company";
import { ISkill } from "../models/skills";
import { ISubscription } from "../models/Subscription";
import { IJob } from "../models/job";
import { IJobApplication } from "../models/jobApplication";
export interface UserServiceResponse {
  user: IUser;
  message: string;
}

export interface CompanySerivceResponse {
  company: ICompany;
  message: string;
}


export  interface SkillServiceResponse{
    skill:ISkill[];
    message:string
}

export interface JobServiceResponse{
    job:IJob;
    message:string
}

export interface JobApplicationResponse{
  application:IJobApplication
    message:string
}

export interface SubscriptionResponse{
  subscription:ISubscription
  message:string
}

export interface MessageResponse{
  channel:string;
  message:string
}

 export interface MeetinngRespose{
  meeting:IMeetingData;
  message:string
 }
 export interface FetchingMeetinngResposes{
  meeting:IMeetingData[];
  message:string
 }
 export interface SubscriptionHistoryResponse{
  subscription:ISubscription[]
  message:string
}