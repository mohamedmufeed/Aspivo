import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";
export class JobRepositories {
  async fetchJob(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await Job.find()
      .populate("company", "companyName logo location")
      .skip(skip)
      .limit(limit);
  }
  async JobDetails(jobId: string) {
    return await Job.findById(jobId).populate("company");
  }
  async findJob(jobId: string) {
    return await Job.findById(jobId);
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
}
