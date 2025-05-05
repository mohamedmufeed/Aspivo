import mongoose, { FilterQuery } from "mongoose";
import { ICompanyDashboardRepositories } from "../interface/repositories/companyDashboardRepostries";
import Job from "../models/job";
import JobApplication from "../models/jobApplication";
import { ApplicationStatusStats } from "../types/dashboardTypes";
import { count } from "console";

export class ComapnyDasboardRepositories implements ICompanyDashboardRepositories {

  async getTotalJobCount(companyId: string): Promise<number> {
    return Job.countDocuments({ company: companyId });
  }

  async getJobCountByDateRange(startDate: Date, endDate: Date, companyId: string) {
    return await Job.countDocuments({ createdAt: { $gte: startDate, $lte: endDate }, company: companyId });
  }

  async getTotalApplicationCount(companyId: string) {
    const result = await JobApplication.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },
      {
        $match: {
          "jobDetails.company": new mongoose.Types.ObjectId(companyId)
        }
      },
      {
        $count: "total"
      }
    ]);

    return result[0]?.total || 0;
  }

  async getApplicationCountByDateRange(startDate: Date, endDate: Date, companyId: string) {
    const result = await JobApplication.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $unwind: "$jobDetails"
      },
      {
        $match: {
          "jobDetails.company": new mongoose.Types.ObjectId(companyId),
          appliedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $count: "total"
      }
    ])
    return result[0]?.total || 0;
  }

  async getTotalNumberOfHirings(companyId: string) {
    const result = await JobApplication.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails", },
      {
        $match: {
          "jobDetails.company": new mongoose.Types.ObjectId(companyId),
          status: "accepted"
        }
      },
      {
        $count: "total"
      }
    ])
    return result[0]?.total || 0;
  }

  async getNumberOfHiringsCountByDateRange(startDate: Date, endDate: Date, companyId: string) {
    const result = await JobApplication.aggregate([
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },
      {
        $match: {
          "jobDetails.company": new mongoose.Types.ObjectId(companyId),
          status: "accepted",
          appliedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $count: "total"
      }
    ])
    return result[0]?.total || 0;
  }



  async getApplicationStatsByCompanyAndDate(companyId: string, startDate?: Date, endDate?: Date):Promise<ApplicationStatusStats[]> {
    const jobIds = await Job.find({ company: companyId }, { _id: 1 }).lean()
    const jobIdArray=jobIds.map((job)=>job._id)
    const matchCondition:FilterQuery<typeof JobApplication> = {
      jobId: { $in: jobIdArray },
    };

    if (startDate && endDate) {
      matchCondition.appliedAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }
  

    const stats= await JobApplication.aggregate([
      {
        $match:matchCondition
      },
      {
        $group:{
          _id:"$status",
          count:{$sum:1}
        }
      }
    ])
    return stats
  }

  async getMostAppliedJobs(companyId:string){
    const mostAppliedJobs=await JobApplication.aggregate([
      {
        $lookup:{
          from:"jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $unwind:"$jobDetails"
      },
      {
        $match:{
          "jobDetails.company":new mongoose.Types.ObjectId(companyId)
        }
      },
      {
        $group:{
          _id:"$jobId",
          count:{$sum:1},
          jobTitle: { $first: "$jobDetails.jobTitle" },
          startDate:{ $first: "$jobDetails.startDate" }
        }
      },
      {$sort:{count:-1}},
      {$limit:4}
    ])
    return mostAppliedJobs
  }
}