import { JobServiceResponse } from "../../../types/interfaceTypes";

export default interface IJobService{
    fetchJob(page:number,limit:number):JobServiceResponse
    getJobDetails(jobId:string):JobServiceResponse;
    applyForJOb(jobId:string,userId:string):JobServiceResponse;
    appliedjobs(userId:string):JobServiceResponse
    isApplied(userId:string,jobId:string):JobServiceResponse
}