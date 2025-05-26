
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
import { mappedHomeJobsDto } from "../utils/dto/userDto";
import { IJobDto } from "../types/userTypes";
import { ALREADY_APPLIED, APPLICATION_FOUND_SUCCESSFULLY, APPLICATION_NOT_FOUND, APPLICATION_SUBMITTED_SUCCESSFULLY, JOB_DETAILS_FETCHED_SUCCESSFULLY, JOB_FETCHED_SUCCESSFULLY, JOB_NOT_FOUND, JOB_REMOVED_FROM_SAVED, JOB_SAVED_SUCCESSFULLY, LATEST_JOBS_FETCHED_SUCCESSFULLY, SAVED_JOBS_FETCHED_SUCCESSFULLY, USER_NOT_FOUND, USER_SAVED_JOBS_POPULATED_SUCCESSFULLY } from "../constants/message";
import { ALL } from "node:dns";


export class JobService implements IJobService {
  private _jobRepositories: IJobRepositories;
  private _authRepositories: IAuthRepository

  constructor(jobRepositories: JobRepositories, authRepostry: AuthRepostry) {
    this._jobRepositories = jobRepositories;
    this._authRepositories = authRepostry
  }
  async fetchJob(page: number, limit: number, searchWord?: string, category?: string): Promise<{ job: IJobDto[], total: number, page: number, totalPages: number, message: string }> {
    const query = this.buildSearchQuery(searchWord, category);

    const job = await this._jobRepositories.fetchJob(page, limit, query);
    const total = await this._jobRepositories.countJobs(query);
    const mappedJobs = job.map(mappedHomeJobsDto);
    return {
      job: mappedJobs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: JOB_FETCHED_SUCCESSFULLY,
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

    if (category && category.trim() !== '') {
      query.category = { $regex: category, $options: 'i' };
    }
    return query;
  }
  async getJobDetails(jobId: string,): Promise<{ job: IJob, message: string }> {
    const job = await this._jobRepositories.JobDetails(jobId);
    // const application = await this._jobRepositories.findApplication(jobId, userId);
    if (!job) throw new Error(JOB_NOT_FOUND);
    // if (!application) throw new Error("Application not found")
    return { job, message: JOB_DETAILS_FETCHED_SUCCESSFULLY };
  }

  async applyForJOb(jobId: string, userId: string): Promise<{ application: IJobApplication & Document, message: string }> {
    if (!userId) throw new Error(USER_NOT_FOUND);
    const job = await this._jobRepositories.findJob(jobId);
    if (!job) throw new Error(JOB_NOT_FOUND);
    const existApplication = await this._jobRepositories.findApplication(
      jobId,
      userId
    );
    if (existApplication)
      throw { error: ALREADY_APPLIED };
    const { application } = await this._jobRepositories.createApplication(jobId, userId);
    if (!application) throw new Error(APPLICATION_NOT_FOUND)
    return { application: application.toObject(), message: APPLICATION_SUBMITTED_SUCCESSFULLY };
  }

  async appliedjobs(userId: string): Promise<{ applications: AppliedJobWithPopulatedData[], message: string }> {
    const applications = await this._jobRepositories.findAppliedJobs(userId);
    if (!applications) throw { status: HttpStatus.NOT_FOUND, message: APPLICATION_NOT_FOUND };
    return { applications, message: SAVED_JOBS_FETCHED_SUCCESSFULLY };
  }

  async isApplied(userId: string, jobId: string): Promise<{ application: IJobApplication | undefined, message: string }> {
    const response = await this._jobRepositories.findApplication(jobId, userId);
    let application
    if (response) {
      application = response
    }
    return { application, message: APPLICATION_FOUND_SUCCESSFULLY }
  }

  async saveJob(userId: string, jobId: string) {
    const user = await this._authRepositories.findById(userId)
    if (!user) throw new Error(USER_NOT_FOUND)
    const job = await this._jobRepositories.findJob(jobId)
    if (!job) throw new Error(JOB_NOT_FOUND)

    const jobIndex = user.savedJobs.findIndex(
      (saved) => saved.jobId.toString() === jobId
    );

    if (jobIndex !== -1) {
      user.savedJobs.splice(jobIndex, 1)
      await user.save()
      return { user, message: JOB_REMOVED_FROM_SAVED };
    } else {
      const obj = new mongoose.Types.ObjectId(jobId)
      user.savedJobs.push({
        jobId: obj,
        savedAt: new Date()
      })
      await user.save()
      return { user, message: JOB_SAVED_SUCCESSFULLY }
    }
  }
  async savedJobs(userId: string) {
    const user = await this._authRepositories.findById(userId)
    if (!user) throw new Error(USER_NOT_FOUND)
    const savedJobs = user.savedJobs
    return { savedJobs, message: SAVED_JOBS_FETCHED_SUCCESSFULLY }
  }

  async populatedSavedJobs(userId: string) {
    const user = await this._authRepositories.findByIdAndPopulate(userId)
    if (!user) throw new Error(USER_NOT_FOUND)
    const savedJobs = user.savedJobs
    return { savedJobs, message: USER_SAVED_JOBS_POPULATED_SUCCESSFULLY }
  }

  async latestJobs() {
    const jobs = await this._jobRepositories.latestJob()
    return { jobs, message: LATEST_JOBS_FETCHED_SUCCESSFULLY }
  }

}
