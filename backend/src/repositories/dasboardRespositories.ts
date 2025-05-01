import { IDashboardRepositories } from "../interface/repositories/dashboardInterface";
import Company from "../models/company";
import Job from "../models/job";
import User from "../models/user";
import { BaseRepository } from "./baseRepository";

export class DashboardRepositories  implements IDashboardRepositories{

    async getUserCountByDateRange(startDate:Date , endDate:Date){
        return await User.countDocuments({
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          });
    }

    async getJobCountByDateRange(startDate:Date , endDate:Date){
        return await Job.countDocuments({ createdAt: { $gte: startDate, $lte: endDate } });
    }

    async  getCompanyCountByDateRange  (startDate: Date, endDate: Date) {
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
  
}