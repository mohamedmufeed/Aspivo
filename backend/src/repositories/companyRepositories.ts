import mongoose from "mongoose";
import Company from "../models/company.js";
import { JobData } from "../types/companyTypes.js";
import Job from "../models/job.js";
import { runInThisContext } from "vm";
export class CompanyRepostries {
  async register(
    companyName: string,
    email: string,
    kyc: string,
    userId: string
  ) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const company = new Company({
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
    return await Company.findOne({ email });
  }
  async findByUserId(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    return await Company.findOne({ userId: userObjectId });
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
    const job = new Job({
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
    return await Job.find({ company: comapanyId }).sort({createdAt:-1});
  }
  async findJob(jobId:string){
  return await Job.findById(jobId)
  }

  async deleteJob(jobId:string){
    return await Job.findByIdAndDelete(jobId)
  }
}
