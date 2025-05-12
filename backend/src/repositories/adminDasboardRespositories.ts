
import { IDashboardRepositories } from "../interface/repositories/dashboardInterface";
import Company from "../models/company";
import Job from "../models/job";
import JobApplication from "../models/jobApplication";
import Subscription from "../models/Subscription";
import User from "../models/user";
import { FilterQuery } from "mongoose";


export class DashboardRepositories implements IDashboardRepositories {

  async getUserCountByDateRange(startDate: Date, endDate: Date) {
    return await User.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }

  async getJobCountByDateRange(startDate: Date, endDate: Date) {
    return await Job.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
  }

  async getCompanyCountByDateRange(startDate: Date, endDate: Date) {
    return await Company.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
  };
  async getTotalUserCount(): Promise<number> {
    return User.countDocuments();
  }

  async getTotalJobCount(): Promise<number> {
    return Job.countDocuments();
  }

  async getTotalCompanyCount(): Promise<number> {
    return Company.countDocuments();
  }

  async getWeeklyApplicationData(startDate?:string,endDate?:string): Promise<{ name: string, applications: number, interviews: number, pending: number, rejected: number }[]> {
    const matchCondition :FilterQuery<typeof JobApplication>= {};
    if (startDate && endDate) {
      matchCondition.appliedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    const result = await JobApplication.aggregate([
      {
        $match: matchCondition
      },
      {
        $project: {
          day: { $dayOfWeek: "$appliedAt" },
          status: 1
        }
      },
      {
        $group: {
          _id: "$day",
          applications: { $sum: 1 },
          interviews: {
            $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const resultMap = new Map(result.map(item => [item._id, item]));
    const fullWeekData = daysOfWeek.map((dayName, index) => {
      const dayNumber = index + 1;
      const data = resultMap.get(dayNumber);
      return {
        name: dayName,
        applications: data?.applications || 0,
        interviews: data?.interviews || 0,
        pending: data?.pending || 0,
        rejected: data?.rejected || 0,
      };
    });
    return fullWeekData;
  }
  
  async getMonthlySubscriptionRevenue() {
    return await Subscription.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" },
        },
      },
    ])}

}