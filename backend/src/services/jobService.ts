
import { JobRepositories } from "../repositories/jobRepositories";
import { IJob } from "../models/job";
import IJobService from "../interface/service/user/jobServiceInterface";
import { IJobApplication } from "../models/jobApplication";
import { AuthRepostry } from "../repositories/userRepositories";
import mongoose from "mongoose";
import HttpStatus from "../utils/httpStatusCode";
import { IAuthRepository } from "../interface/repositories/userRepositories";
import { IJobRepositories } from "../interface/repositories/jobRespositoires";
import { AppliedJobWithPopulatedData } from "../types/companyTypes";


export class JobService implements IJobService {
  private _jobRepositories: IJobRepositories;
  private _authRepositories: IAuthRepository

  constructor(jobRepositories: JobRepositories, authRepostry: AuthRepostry) {
    this._jobRepositories = jobRepositories;
    this._authRepositories = authRepostry
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
  async getJobDetails(jobId: string,): Promise<{ job: IJob, message: string }> {
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

  async appliedjobs(userId: string): Promise<{ applications: AppliedJobWithPopulatedData[], message: string }> {
    const applications = await this._jobRepositories.findAppliedJobs(userId);
    if (!applications) throw { status: HttpStatus.NOT_FOUND, message: "application not found" };
    return { applications, message: "saved job fethced sucsess fully" };
  }

  async isApplied(userId: string, jobId: string): Promise<{ application: IJobApplication | undefined, message: string }> {
    const response = await this._jobRepositories.findApplication(jobId, userId);
    let application
    if (response) {
      application = response
    }
    return { application, message: "Application found sucsess fully" }
  }

  async saveJob(userId: string, jobId: string) {
    const user = await this._authRepositories.findById(userId)
    if (!user) throw new Error("User not found")
    const job = await this._jobRepositories.findJob(jobId)
    if (!job) throw new Error("Job not found")

    const jobIndex = user.savedJobs.findIndex(
      (saved) => saved.jobId.toString() === jobId
    );

    if (jobIndex !== -1) {
      user.savedJobs.splice(jobIndex, 1)
      await user.save()
      return { user, message: "Job removed from saved jobs" };
    } else {
      const obj = new mongoose.Types.ObjectId(jobId)
      user.savedJobs.push({
        jobId: obj,
        savedAt: new Date()
      })
      await user.save()
      return { user, message: "User job saved sucess fully" }
    }
  }
  async savedJobs(userId: string) {
    const user = await this._authRepositories.findById(userId)
    if (!user) throw new Error("User not found")
    const savedJobs = user.savedJobs
    return { savedJobs, message: "User saved jobs found sucessfully" }
  }

  async populatedSavedJobs(userId: string) {
    const user = await this._authRepositories.findByIdAndPopulate(userId)
    if (!user) throw new Error("User not found")
    const savedJobs = user.savedJobs
    return { savedJobs, messsage: "User saved job  populated sucsess fully" }
  }

   async latestJobs(){
    const jobs=await this._jobRepositories.latestJob()
    return {jobs , message:"latest job fetched sucsessfully"}
   }
}
