import {  JobDocumnet } from "../../../models/job";
import { IJobApplication, PopulateIJob, PopulateIUser } from "../../../models/jobApplication";

import { JobData } from "../../../types/companyTypes";
import { CompanySerivceResponse, JobApplicationResponse, JobServiceResponse } from "../../../types/interfaceTypes";
export interface IPopulatedJobApplication extends Omit<IJobApplication, "userId" | "jobId"> {
    userId: PopulateIUser;
    jobId: Pick<PopulateIJob, "jobTitle" | "typesOfEmployment" | "company">;
  }
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export default interface IJobService {
    fetchCompany(userId: string): Promise<CompanySerivceResponse>;
    postJob(data: JobData):Promise<{job:JobDocumnet, message:string}>;
    editJob(jobId: string, data: JobData):Promise< JobServiceResponse>;
    deleteJob(jobId: string):Promise< JobServiceResponse>;
    getApplicantsForJob(jobid: string, comapanyId: string): Promise<{applications:IJobApplication[], message:string}>;
    getApplicantDetials(applicantId: string):any;
    updateStatus(applicantId: string, status: ApplicationStatus): Promise<JobApplicationResponse>

}