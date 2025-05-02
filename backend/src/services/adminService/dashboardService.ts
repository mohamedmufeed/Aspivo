import { MONTHS, USD_TO_INR } from "../../constants/commen";
import { IDashboardService } from "../../interface/service/admin/dashboardServiceInterface";
import { DashboardRepositories } from "../../repositories/dasboardRespositories";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export class DashboardService implements IDashboardService {
  constructor(private _dashboardReposrtories: DashboardRepositories) { }


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

  async getWeeklyApplicationData() {
    const response = await this._dashboardReposrtories.getWeeklyApplicationData()
    if (!response) {
      throw new Error("Weekly application data not found")
    }
    return { response, message: "Application Feched sucsessfull" }
  }

  async getMonthlySubscriptionRevenue() {
    const rawRevenue = await this._dashboardReposrtories.getMonthlySubscriptionRevenue()
    if (!rawRevenue) throw new Error("Monthly Revenue data not found")
      const mergedRevenue = MONTHS.map((month) => {
        const found = rawRevenue.find((r) => r._id === month.month);
        return {
          name: month.name,
          subscription: found ? Math.round(found.totalRevenue * USD_TO_INR) : 0,
        };
      })
      return mergedRevenue
}
}