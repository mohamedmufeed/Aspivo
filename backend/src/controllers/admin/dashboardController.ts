import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/error";
import IDashboardController from "../../interface/controller/admin/dashboardControllerInterface";
import { DashboardService } from "../../services/adminService/dashboardService";
import HttpStatus from "../../utils/httpStatusCode";

export class DashboardController implements IDashboardController {
    constructor(private _dashboardService: DashboardService) { }

    getStats = async (req: Request, res: Response) => {
        try {
            const response = await this._dashboardService.getDashboardStats()
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message ||ERROR_MESSAGES.SERVER_ERROR })
        }
    }

    getWeeklyApplicationData = async (req: Request, res: Response) => {
        try {
            const response = await this._dashboardService.getWeeklyApplicationData()
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message ||ERROR_MESSAGES.SERVER_ERROR })
        }
    }


    getMonthlySubscriptionRevenue= async (req:Request, res:Response)=>{
        try {
            const response= await this._dashboardService.getMonthlySubscriptionRevenue()
            res.status(HttpStatus.OK).json({response, message:"Monthly Revenue Fetched sucsessfully"})
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message||ERROR_MESSAGES.SERVER_ERROR})
        }
    }
}