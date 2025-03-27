import { use } from "passport";
import { JobRepositories } from "../repositories/jobRepositories.js";
import Job from "../models/job.js";

const jobrepositories = new JobRepositories();
export class JobService {
  async fetchJob(page: number, limit: number) {
    const job = await jobrepositories.fetchJob(page, limit);
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
  async getJobDetails(jobId: string) {
    const job = await jobrepositories.JobDetails(jobId);
    if (!job) throw new Error("Job not found");
    return { job, messsage: "Job detaails fetched succsess fully" };
  }

  async applyForJOb(jobId: string, userId: string) {
    if (!userId) throw new Error("User not found");
    const job = await jobrepositories.findJob(jobId);
    if (!job) throw new Error("Job not found");
    const existApplication = await jobrepositories.findApplication( jobId, userId );
    if(existApplication) throw {error:"You have already applied for this job."}
    const application=await jobrepositories.createApplication(jobId,userId)
    return {application, message:"JOb application sucsess"}

  }
  async appliedjobs(userId:string){
    const applications= await jobrepositories.findAppliedJobs(userId)
    if(!applications ) throw {status:404, message:"application not found"}
    return {applications, message:'saved job fethced sucsess fully'}
  }


}
