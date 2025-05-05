import { IMostAppliedJobs } from "../../types/companyTypes"
import { ApplicationStatusStats } from "../../types/dashboardTypes"


export interface ICompanyDashboardRepositories{
    getTotalJobCount(companyId:string):Promise<number>
    getJobCountByDateRange(startDate:Date, endDate:Date, companyId:string):Promise<number>
    getTotalApplicationCount(companyId:string):Promise<number>
    getApplicationCountByDateRange(startDate:Date, endDate:Date, companyId:string):Promise<number>
    getTotalNumberOfHirings(companyId:string):Promise<number>
    getNumberOfHiringsCountByDateRange(startDate:Date, endDate:Date, companyId:string):Promise<number>
    getApplicationStatsByCompanyAndDate(companyId: string, startDate: Date, endDate: Date):Promise<ApplicationStatusStats[]>
    getMostAppliedJobs(companyId:string):Promise<IMostAppliedJobs[]>

}