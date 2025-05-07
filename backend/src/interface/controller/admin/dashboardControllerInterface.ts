
import { Request, Response } from "express";

export default interface IDashboardController{
    getStats(req:Request, res:Response):Promise<void>
    getWeeklyApplicationData(req:Request,res:Response):Promise<void>
    getMonthlySubscriptionRevenue(req:Request, res:Response):Promise<void>
    downloadExcelFile(req:Request,res:Response):Promise<void>
}