import { JobDocumnet } from "../../models/job";
import { JobApplicationDocument } from "../../models/jobApplication";
import { AppliedJobWithPopulatedData } from "../../types/companyTypes";


export interface IJobRepositories {
  fetchJob(page: number, limit: number): Promise<JobDocumnet[]>;
  JobDetails(jobId: string): Promise<JobDocumnet | null>;
  findJob(jobId: string): Promise<JobDocumnet | null>;
  findApplication(jobId: string, userId: string): Promise<JobApplicationDocument | null>;
  createApplication(jobId: string, userId: string): Promise<{ application: JobApplicationDocument }>;
  findAppliedJobs(userId: string): Promise<AppliedJobWithPopulatedData[]>;
  latestJob():Promise<JobDocumnet[]>
}
