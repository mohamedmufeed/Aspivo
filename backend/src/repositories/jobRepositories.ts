
import Job, { JobDocumnet } from "../models/job";
import JobApplication from "../models/jobApplication";
import { BaseRepository } from "./baseRepository";
import { IJobRepositories } from "../interface/repositories/jobRespositoires";
export class JobRepositories extends BaseRepository<JobDocumnet>  implements IJobRepositories {
  constructor (){
    super(Job)
  }
  async fetchJob(page: number, limit: number, query = {}) {
    const skip = (page - 1) * limit;
    const finalQuery = { ...query, isActive: true };
     return await Job.find(finalQuery)
      .populate("company", "companyName logo location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }
  
  async countJobs(query = {}) {
    return await Job.countDocuments(query);
  }
async JobDetails(jobId: string) {
  try {
    const jobDetails = await Job.findById(jobId).populate("company")
    return jobDetails;
  } catch (error) {
    const err=error as Error
    throw new Error(`Failed to fetch job details ${err.message}.`);
  }
}

  async findJob(jobId: string) {
    return await this.findById(jobId);
  }
  async findApplication(jobId: string, userId: string) {
    return await JobApplication.findOne({ jobId, userId });
  }
  async createApplication(jobId: string, userId: string) {
    const application = new JobApplication({
      userId: userId,
      jobId: jobId,
      status: "pending",
      appliedAt: Date.now(),
    });
    const savedApplication = await application.save();
    return { application: savedApplication };
  }

  async findAppliedJobs(userId: string):Promise<any[]> {
    return await JobApplication.find({userId:userId})
    .populate({
      path: "jobId", 
      select: "jobTitle maximumSalary minimumSalary location typesOfEmployment", 
      populate: {
        path: "company", 
        select: "companyName logo location", 
      },
    })


  }

   async latestJob(){
    return await Job.find().populate("company" , "companyName logo location").sort({createdAt:-1}).limit(3)
   }
}
