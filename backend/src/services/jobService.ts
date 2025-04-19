import { use } from "passport";
import { JobRepositories } from "../repositories/jobRepositories";
import Job from "../models/job";


export class JobService {
  private _jobRepositories: JobRepositories;


  constructor(jobRepositories: JobRepositories) {
    this._jobRepositories = jobRepositories;
  }
  async fetchJob(page: number, limit: number) {
    const job = await this._jobRepositories.fetchJob(page, limit);
    if (!job || job.length === 0) throw new Error("Job not found");
    const total = await Job.countDocuments();

    return {
      job: job,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: "Job fetched successfully",
    };
  }
  async getJobDetails(jobId: string, userId: string) {
    const job = await this._jobRepositories.JobDetails(jobId);
    const application = await this._jobRepositories.findApplication(jobId, userId);
    if (!job) throw new Error("Job not found");
    const hasApplied = !!application;
    return { job, application, message: "Job details fetched successfully" };
  }
  async applyForJOb(jobId: string, userId: string) {
    if (!userId) throw new Error("User not found");
    const job = await this._jobRepositories.findJob(jobId);
    if (!job) throw new Error("Job not found");
    const existApplication = await this._jobRepositories.findApplication(
      jobId,
      userId
    );
    if (existApplication)
      throw { error: "You have already applied for this job." };
    const application = await this._jobRepositories.createApplication(jobId, userId);
    return { application, message: "JOb application sucsess" };
  }
  async appliedjobs(userId: string) {
    const applications = await this._jobRepositories.findAppliedJobs(userId);
    if (!applications) throw { status: 404, message: "application not found" };
    return { applications, message: "saved job fethced sucsess fully" };
  }

  async isApplied(userId: string, jobId: string) {
    const application = await this._jobRepositories.findApplication(jobId, userId);
    return {application , message:"Application found sucsess fully"}
  }
}
