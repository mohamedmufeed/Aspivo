
import { JobRepositories } from "../repositories/jobRepositories";
import  { IJob } from "../models/job";
import IJobService from "../interface/service/user/jobServiceInterface";
import { IJobApplication } from "../models/jobApplication";


export class JobService implements IJobService {
  private _jobRepositories: JobRepositories;


  constructor(jobRepositories: JobRepositories) {
    this._jobRepositories = jobRepositories;
  }
  async fetchJob(page: number, limit: number, searchWord?: string, category?: string): Promise<{ job: IJob[], total: number, page: number, totalPages: number, message: string }> {
    const query = this.buildSearchQuery(searchWord, category);
    
    const job = await this._jobRepositories.fetchJob(page, limit, query);
    const total = await this._jobRepositories.countJobs(query);
    
    return {
      job: job,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: "Job fetched successfully",
    };
  }
  
  private buildSearchQuery(searchWord?: string, category?: string) {
    const query: any = {};
    
    if (searchWord) {
      query['$or'] = [
        { jobTitle: { $regex: searchWord, $options: 'i' } },
        { 'company.companyName': { $regex: searchWord, $options: 'i' } },
        { 'company.location': { $regex: searchWord, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    return query;
  }
  async getJobDetails(jobId: string, ): Promise<{ job: IJob, message: string }> {
    const job = await this._jobRepositories.JobDetails(jobId);
    // const application = await this._jobRepositories.findApplication(jobId, userId);
    if (!job) throw new Error("Job not found");
    // if (!application) throw new Error("Application not found")
    return { job, message: "Job details fetched successfully" };
  }

  async applyForJOb(jobId: string, userId: string): Promise<{ application: IJobApplication & Document, message: string }> {
    if (!userId) throw new Error("User not found");
    const job = await this._jobRepositories.findJob(jobId);
    if (!job) throw new Error("Job not found");
    const existApplication = await this._jobRepositories.findApplication(
      jobId,
      userId
    );
    if (existApplication)
      throw { error: "You have already applied for this job." };
    const { application } = await this._jobRepositories.createApplication(jobId, userId);
    if (!application) throw new Error("Appliation not found")
    return { application: application.toObject(), message: "JOb application sucsess" };
  }


  async appliedjobs(userId: string): Promise<{ applications: IJobApplication[], message: string }> {
    const applications = await this._jobRepositories.findAppliedJobs(userId);
    if (!applications) throw { status: 404, message: "application not found" };
    return { applications, message: "saved job fethced sucsess fully" };
  }

  async isApplied(userId: string, jobId: string): Promise<{ application: IJobApplication|undefined, message: string }> {
    const response = await this._jobRepositories.findApplication(jobId, userId);
    let application
    if (response) {
      application = response
    }
    return { application, message: "Application found sucsess fully" }
  }
}
