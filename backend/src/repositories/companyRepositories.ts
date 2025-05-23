import mongoose from "mongoose";
import Company, { CompanyDocument } from "../models/company";
import { JobData } from "../types/companyTypes";
import Job from "../models/job";
import JobApplication from "../models/jobApplication";
import User from "../models/user";
import { GetPaginationQuery } from "../types/userTypes";
import  { PipelineStage } from "mongoose";
type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";
export class CompanyRepostries implements CompanyRepostries {
  constructor(private jobModel: typeof Job, private companyModel: typeof Company, private jobApplication: typeof JobApplication, private _userModel: typeof User) { }
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

  async findByEmail(email: string): Promise<CompanyDocument | null> {
    return await this.companyModel.findOne({ email });
  }

  async findById(id: string) {
    return await this.companyModel.findById(id)
  }
  async findByUserId(userId: string): Promise<CompanyDocument | null> {
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


  async decreaseJobLimit(id: string) {
    return await this.companyModel.findByIdAndUpdate(
      id,
      { $inc: { jobLimit: -1 } },
      { new: true }
    );
  }
  async findJobs(comapanyId: string) {
    return await this.jobModel.find({ company: comapanyId, isActive: true }).sort({ createdAt: -1 });
  }

  async findAllJobs(companyId: string, { page, limit, searchQuery }: GetPaginationQuery) {
    const skip = (page - 1) * limit;

    const filter = {
      company: companyId,
      ...(searchQuery && {
        $or: [
          { jobTitle: { $regex: searchQuery, $options: "i" } },
          { category: { $regex: searchQuery, $options: "i" } },
        ],
      }),
    };


    const jobs = await this.jobModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });;
    const totalJobs = await this.jobModel.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limit);
    return  {jobs , totalJobs, totalPages}
  }

  async findJob(jobId: string) {
    return await this.jobModel.findById(jobId)
  }

  async chageStatus(jobId: string, status: boolean) {
    return await this.jobModel.findByIdAndUpdate(
      jobId,
      { isActive: status },
      { new: true }
    );
  }



async findApplications(
  jobId: string,
  { page, limit, searchQuery }: GetPaginationQuery
) {
  const skip = (page - 1) * limit;

  const searchConditions: PipelineStage.Match["$match"] = searchQuery
    ? {
        $or: [
          { "user.firstName": { $regex: searchQuery, $options: "i" } },
          { "job.jobTitle": { $regex: searchQuery, $options: "i" } },
        ],
      }
    : {};

  const pipeline: PipelineStage[] = [
    {
      $match: {
        jobId: new mongoose.Types.ObjectId(jobId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    ...(searchQuery ? [{ $match: searchConditions }] : []),
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await this.jobApplication.aggregate(pipeline);

  const applications = result[0]?.data || [];
  const totalApplications = result[0]?.totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalApplications / limit);

  return {
    applications,
    totalPages,
    totalApplications,
  };
}


  async findApplicationDetail(applicantId: string) {
    return await this.jobApplication.findById(applicantId).populate("userId")
      .populate("jobId", "jobTitle typesOfEmployment company")
 
  }

  async findApplicationAndUpdate(applicantId: string, status: ApplicationStatus) {
    return await this.jobApplication.findByIdAndUpdate(applicantId, { status }, { new: true })
  }

  async findUser(userId: string) {
    return await this._userModel.findById(userId)
  }

}



