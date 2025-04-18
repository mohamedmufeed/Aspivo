import path from "path";
import Job from "../models/job";
import JobApplication from "../models/jobApplication";
export class JobRepositories {
  async fetchJob(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const totalJobs = await Job.countDocuments();
    return await Job.find()
        .populate("company", "companyName logo location")
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit);
}
async JobDetails(jobId: string) {
  try {
    const jobDetails = await Job.findById(jobId).populate("company")
    return jobDetails;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw new Error("Failed to fetch job details.");
  }
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

  async findAppliedJobs(userId: string) {
    return await JobApplication.find({userId:userId})
    .populate({
      path: "jobId", 
      select: "jobTitle maximumSalary minimumSalary location typesOfEmployment", 
      populate: {
        path: "company", 
        select: "companyName logo location", 
      },
    })
    .lean(); 

  }
}
