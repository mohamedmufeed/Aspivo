
import {  IJob, JobDocumnet } from "../../../models/job";
import { IJobApplication, PopulateIJob, PopulateIUser } from "../../../models/jobApplication";
import { GetJobResponse, IJobStatusDto, JobData } from "../../../types/companyTypes";
import { CompanySerivceResponse, JobApplicationResponse, JobServiceResponse } from "../../../types/interfaceTypes";
import { GetJobApplicationResponse, GetPaginationQuery } from "../../../types/userTypes";
export interface IPopulatedJobApplication extends Omit<IJobApplication, "userId" | "jobId"> {
    userId: PopulateIUser;
    jobId: Pick<PopulateIJob, "jobTitle" | "typesOfEmployment" | "company">;
  }
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export default interface IJobServiceInterface {
    fetchCompany(userId: string): Promise<CompanySerivceResponse>;
    postJob(data: JobData):Promise<{job:JobDocumnet, message:string}>;
    editJob(jobId: string, data: JobData):Promise< JobServiceResponse>;
    chageJobStatus(jobId: string):Promise<{ job: { _id: string; isActive: boolean | undefined; }, message: string }>;
    getApplicantsForJob(jobid: string, comapanyId: string, query:GetPaginationQuery): Promise<GetJobApplicationResponse>;
    getApplicantDetials(applicantId: string):any;
    updateStatus(applicantId: string, status: ApplicationStatus): Promise<JobApplicationResponse>
    fetchJob(comapanyId:string,query:GetPaginationQuery):Promise<GetJobResponse>
getEditJobDetails(jobId:string):Promise<{job:IJob, message:string}>

}