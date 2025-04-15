import mongoose from "mongoose";
import Company from "../models/company.js";
import { JobData } from "../types/companyTypes.js";
import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";
type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export class CompanyRepostries {
  constructor(private jobModel: typeof Job , private companyModel: typeof Company, private jobApplication: typeof JobApplication) {}
  async register(
    companyName: string,
    email: string,
    kyc: string,
    userId: string
  ) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const company = new this.companyModel({
      companyName,
      email,
      kyc,
      verified: false,
      userId: userObjectId,
      status: "Pending",
    });
    const savedCompany = await company.save();
    return { company: savedCompany };
  }

  async findByEmail(email: string) {
    return await this.companyModel.findOne({ email });
  }
  async findByUserId(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    return await this.companyModel.findOne({ userId: userId });
  }

  async createJob(data: JobData) {
    const {
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
      company,
    } = data;
    const comapanyId = new mongoose.Types.ObjectId(company);
    const job = new this.jobModel({
      jobTitle,
      category,
      typesOfEmployment,
      maximumSalary,
      minimumSalary,
      qualification,
      requiredSkills,
      jobResponsibilities,
      startDate,
      endDate,
      slot,
      requirements,
      jobDescription,
      company: comapanyId,
    });

    const savedJob = await job.save();
    return { job: savedJob };
  }
  async findJobs(comapanyId: string) {
    return await this.jobModel.find({company:comapanyId}).sort({createdAt:-1});
  }
  async findJob(jobId:string){
  return await this.jobModel.findById(jobId)
  }

  async deleteJob(jobId:string){
    return await this.jobModel.findByIdAndDelete(jobId)
  }
  async findApplications(jobId:string){
    return await this.jobApplication.find({jobId})
    .populate("userId","firstName lastName profileImage")
    .populate("jobId","jobId jobTitle")
  }
  async findApplicationDetail(applicantId:string){
    return await this.jobApplication.findById(applicantId).populate("userId")
    .populate("jobId", "jobTitle typesOfEmployment company")
   }

   async findApplicationAndUpdate(applicantId:string,status:ApplicationStatus){
    return await this.jobApplication.findByIdAndUpdate(applicantId,{status},{new:true})
   }
   
}



