import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../constants/error";
import IDashboardController from "../../interface/controller/admin/dashboardControllerInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { IDashboardService } from "../../interface/service/admin/dashboardServiceInterface";

export class DashboardController implements IDashboardController {
    constructor(private _dashboardService: IDashboardService) { }

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
            const {startDate,endDate}=req.query
            const response = await this._dashboardService.getWeeklyApplicationData(startDate as string,endDate as string)
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

      downloadExcelFile=async(req:Request,res:Response)=>{
        try {
            const {startDate, endDate, type}=req.query
            const workbook=await this._dashboardService.downloadExcel(startDate as string,endDate  as string, type as string)
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            res.setHeader("Content-Disposition", `attachment; filename=${type}-report.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            res.status(HttpStatus.NOT_FOUND).json({ message: "Failed to generate Excel file", error });
        }
    }
}