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
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR })
        }
    }
}