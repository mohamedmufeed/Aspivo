import { DashboardStats, StatResult } from "../../../types/dashboardTypes";

export interface IDashboardService{
    calculateStats(total:number,last:number):StatResult
    getDashboardStats():Promise<DashboardStats>
}