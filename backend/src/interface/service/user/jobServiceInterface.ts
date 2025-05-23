import { IJob } from "../../../models/job";
import { IJobApplication } from "../../../models/jobApplication";
import { ISavedJobs, IUser } from "../../../models/user";
import { AppliedJobWithPopulatedData, IComapny } from "../../../types/companyTypes";
import { IJobDto, PopulatedSavedJob } from "../../../types/userTypes";

export default interface IJobService{
    fetchJob(page:number,limit:number,searchWord?:string, category?:string):Promise<{job:IJobDto[],total:number,page:number,totalPages:number, message:string}>
    getJobDetails(jobId:string,userId?:string):Promise<{job:IJob, message:string}>;
    applyForJOb(jobId:string,userId:string):Promise<{application:IJobApplication& Document, message:string}>;
    appliedjobs(userId:string):Promise<{applications:AppliedJobWithPopulatedData[], message:string}>
    isApplied(userId:string,jobId:string):Promise<{application:IJobApplication|undefined, message:string}>
    saveJob(userId:string,jobId:string):Promise<{user:IUser, message:string}>
    savedJobs(userId:string):Promise<{savedJobs:ISavedJobs[], message:string}>
    latestJobs():Promise<{jobs:IJob[], message:string}>
    populatedSavedJobs(userId:string):Promise<{savedJobs:PopulatedSavedJob[]; message:string}>
}