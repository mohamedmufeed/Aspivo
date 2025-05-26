import { MONTHS, USD_TO_INR } from "../../constants/commen";
import {  APPLICATION_FETCHED_SUCCESSFULLY, MONTHLY_REVENUE_DATA_NOT_FOUND } from "../../constants/message";
import { IDashboardRepositories } from "../../interface/repositories/dashboardInterface";
import { IDashboardService } from "../../interface/service/admin/dashboardServiceInterface";
import { DashboardRepositories } from "../../repositories/adminDasboardRespositories";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import ExcelJS from 'exceljs';



export class DashboardService implements IDashboardService {
  constructor(private _dashboardReposrtories: IDashboardRepositories) { }


  calculateStats(total: number, lastWeek: number) {
    const diff = total - lastWeek;
    const direction = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
    const percentage = lastWeek > 0 ? ((diff / lastWeek) * 100).toFixed(2) : "N/A";
    return { total, lastWeek, diff, direction, percentage };
  }

  async getDashboardStats() {
    const today = new Date();
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

    const lastWeekStart = subWeeks(thisWeekStart, 1);
    const lastWeekEnd = subWeeks(thisWeekEnd, 1);

    const [userTotal, userLastWeek] = await Promise.all([
      this._dashboardReposrtories.getTotalUserCount(),
      this._dashboardReposrtories.getUserCountByDateRange(lastWeekStart, lastWeekEnd),
    ]);

    const [jobTotal, jobLastWeek] = await Promise.all([
      this._dashboardReposrtories.getTotalJobCount(),
      this._dashboardReposrtories.getJobCountByDateRange(lastWeekStart, lastWeekEnd),
    ]);

    const [companyTotal, companyLastWeek] = await Promise.all([
      this._dashboardReposrtories.getTotalCompanyCount(),
      this._dashboardReposrtories.getCompanyCountByDateRange(lastWeekStart, lastWeekEnd),
    ]);

    return {
      users: this.calculateStats(userTotal, userLastWeek),
      jobs: this.calculateStats(jobTotal, jobLastWeek),
      companies: this.calculateStats(companyTotal, companyLastWeek),
    };
  }

  async getWeeklyApplicationData(startDate: string, endDate: string) {
    if (startDate && endDate) {
      const response = await this._dashboardReposrtories.getWeeklyApplicationData(startDate, endDate)
      if (!response) throw new Error("No Response found")
      return { response, message:APPLICATION_FETCHED_SUCCESSFULLY }
    } else {
      const response = await this._dashboardReposrtories.getWeeklyApplicationData()
      if (!response) throw new Error("No Response found")
      return { response, message: APPLICATION_FETCHED_SUCCESSFULLY }
    }
  }

  async getMonthlySubscriptionRevenue() {
    const rawRevenue = await this._dashboardReposrtories.getMonthlySubscriptionRevenue()
    if (!rawRevenue) throw new Error(MONTHLY_REVENUE_DATA_NOT_FOUND)
    const mergedRevenue = MONTHS.map((month) => {
      const found = rawRevenue.find((r) => r._id === month.month);
      return {
        name: month.name,
        subscription: found ? Math.round(found.totalRevenue * USD_TO_INR) : 0,
      };
    })
    return mergedRevenue
  }

  async downloadExcel(startDate: string, endDate: string, dataType: string): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    let data= [];
    let worksheet: ExcelJS.Worksheet;
  
    if (dataType === "ApplicationData") {
      data = (await this.getWeeklyApplicationData(startDate, endDate)).response;
      worksheet = workbook.addWorksheet("Weekly Stats");
      worksheet.columns = [
        { header: "Day", key: "name", width: 15 },
        { header: "Applications", key: "applications", width: 15 },
        { header: "Interviews", key: "interviews", width: 15 },
        { header: "Pending", key: "pending", width: 15 },
        { header: "Rejected", key: "rejected", width: 15 },
      ];
    } else if (dataType === "RevenueData") {
      data = await this.getMonthlySubscriptionRevenue();
      worksheet = workbook.addWorksheet("Revenue Stats");
      worksheet.columns = [
        { header: "Month", key: "name", width: 15 },
        { header: "Revenue", key: "subscription", width: 15 },
      ];
    } else {
      throw new Error("Invalid dataType");
    }
  
    data.forEach(item => worksheet.addRow(item));
  
    return workbook;
  }
  
}