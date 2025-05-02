import { DashboardStats, MonthlyData, StatResult, WeeklyData } from "../../../types/dashboardTypes";

export interface IDashboardService{
    calculateStats(total:number,last:number):StatResult
    getDashboardStats():Promise<DashboardStats>
    getWeeklyApplicationData():Promise<{ response:WeeklyData[], message:string}>
    getMonthlySubscriptionRevenue():Promise<MonthlyData[]>
}