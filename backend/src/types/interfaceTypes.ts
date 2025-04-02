import { SkillItemList, User } from "./userTypes";
import { Company, JobApplication, JobData } from "./companyTypes";
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