import { CompanyDocument } from "../../models/company";
import { IJob, JobDocumnet } from "../../models/job";
import { JobApplicationDocument } from "../../models/jobApplication";
import { ApplicationStatus } from "../service/company/jobInterface";

export interface CompanyRepostries {

  register(companyName: string, email: string, kyc: string, userId: string): Promise<{ company: CompanyDocument }>;


  findByEmail(email: string): Promise<CompanyDocument | null>;


  findByUserId(userId: string): Promise<CompanyDocument | null>;


  createJob(data: IJob): Promise<{ job: JobDocumnet }>;

  findJobs(companyId: string): Promise<JobDocumnet[]>;

  findJob(jobId: string): Promise<JobDocumnet | null>;

  
  deleteJob(jobId: string): Promise<JobDocumnet | null>;

  findApplications(jobId: string): Promise<[]>;


  findApplicationDetail(applicantId: string): Promise<JobApplicationDocument | null>;

  
  findApplicationAndUpdate(applicantId: string, status: ApplicationStatus): Promise<JobApplicationDocument | null>;
}
