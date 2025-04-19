import { SkillItemList, User ,ISubscription} from "./userTypes";
import { Company, IMeetingData, JobApplication, JobData } from "./companyTypes";
export interface UserServiceResponse {
  user: User;
  message: string;
}

export interface CompanySerivceResponse {
  company: Company;
  message: string;
}


export  interface SkillServiceResponse{
    skill:SkillItemList;
    message:string
}

export interface JobServiceResponse{
    job:JobData;
    message:string
}

export interface JobApplicationResponse{
    applications:JobApplication
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