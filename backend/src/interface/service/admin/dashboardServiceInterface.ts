import ExcelJS from "exceljs";
import { DashboardStats, MonthlyData, StatResult, WeeklyData } from "../../../types/dashboardTypes";

export interface IDashboardService{
    calculateStats(total:number,last:number):StatResult
    getDashboardStats():Promise<DashboardStats>
    getWeeklyApplicationData(startDate:string,endDate:string):Promise<{ response:WeeklyData[], message:string}>
    getMonthlySubscriptionRevenue():Promise<MonthlyData[]>
    downloadExcel(startDate:string,endDate:string,dataType:string):Promise<ExcelJS.Workbook>
}