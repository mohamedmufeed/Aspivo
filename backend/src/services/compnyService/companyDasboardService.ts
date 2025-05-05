import { endOfWeek, startOfWeek, subWeeks } from "date-fns";
import { ICompanyDashboardService } from "../../interface/service/company/dasboardInterface";
import { ComapnyDasboardRepositories } from "../../repositories/companyDasboardRespostries";

export class CompanyDasboradService implements ICompanyDashboardService {
    constructor(private _comapnyDasboardRepostries: ComapnyDasboardRepositories) { }
    calculateStats(total: number, lastWeek: number) {
        const diff = total - lastWeek;
        const direction = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
        const percentage = lastWeek > 0 ? ((diff / lastWeek) * 100).toFixed(2) : "N/A";
        return { total, lastWeek, diff, direction, percentage };
    }


    async getComapnyDashboardStats(companyId: string) {
        console.log("helo")
        const today = new Date();
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });

        const lastWeekStart = subWeeks(thisWeekStart, 1);
        const lastWeekEnd = subWeeks(thisWeekEnd, 1);

        const [jobTotal, jobLastWeek] = await Promise.all([
            this._comapnyDasboardRepostries.getTotalJobCount(companyId),
            this._comapnyDasboardRepostries.getJobCountByDateRange(lastWeekStart, lastWeekEnd, companyId),
        ]);

        const [applicationToatal, applicationLastWeek] = await Promise.all([
            this._comapnyDasboardRepostries.getTotalApplicationCount(companyId),
            this._comapnyDasboardRepostries.getApplicationCountByDateRange(lastWeekStart, lastWeekEnd, companyId),
        ]);

        const [numberOfHiringsTotal, numberOfHiringsLastWeek] = await Promise.all([
            this._comapnyDasboardRepostries.getTotalNumberOfHirings(companyId),
            this._comapnyDasboardRepostries.getNumberOfHiringsCountByDateRange(lastWeekStart, lastWeekEnd, companyId),
        ]);

        return {
            applications: this.calculateStats(applicationToatal, applicationLastWeek),
            jobs: this.calculateStats(jobTotal, jobLastWeek),
            numberOfHirings: this.calculateStats(numberOfHiringsTotal, numberOfHiringsLastWeek),
        };
    }

    async getApplicationStatusByDate(companyId: string, start?: string, end?: string) {
        if (start && end) {
            const startDate = new Date(start)
            const endDate = new Date(end)
            const status = await this._comapnyDasboardRepostries.getApplicationStatsByCompanyAndDate(companyId, startDate, endDate)
            const formatedStatus = {
                shortlisted: status.find((s) => s._id === "reviewed")?.count || 0,
                hired: status.find((s) => s._id === "accepted")?.count || 0,
                rejected: status.find((s) => s._id === "rejected")?.count || 0
            }
            return formatedStatus
        } else {
            const status = await this._comapnyDasboardRepostries.getApplicationStatsByCompanyAndDate(companyId)
            const formatedStatus = {
                shortlisted: status.find((s) => s._id === "reviewed")?.count || 0,
                hired: status.find((s) => s._id === "accepted")?.count || 0,
                rejected: status.find((s) => s._id === "rejected")?.count || 0
            }
            return formatedStatus
        }
    }

    async getMostAppliedJobs(companyId: string) {
        if (!companyId) throw new Error("Company id is requierd")
        const response = await this._comapnyDasboardRepostries.getMostAppliedJobs(companyId)
        return { response, message: "Most applied jobs found sucsessfull" }
    }
}