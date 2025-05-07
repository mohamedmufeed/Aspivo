import { Request, Response } from "express";
import { ICompanyDashboardController } from "../../interface/controller/company/companyDasboardInterface";
import { CompanyDasboradService } from "../../services/compnyService/companyDasboardService";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/error";




export class CompanyDasboradController implements ICompanyDashboardController {
    constructor(private _companyDashboardService: CompanyDasboradService) { }
    async getDashboardStatus(req: Request, res: Response) {
        try {
            const companyId = req.params.id
            const response = await this._companyDashboardService.getComapnyDashboardStats(companyId)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err = error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR })
        }
    }

    async getApplicationStatusByDate(req: Request, res: Response) {
        try {
            const companyId = req.params.id
            const {startDate,endDate}=req.query
            const response = await this._companyDashboardService.getApplicationStatusByDate(companyId, startDate as string, endDate as string)
            res.status(HttpStatus.OK).json({ response: response, message: "Company aplication data fetched sucsessfully" })
        } catch (error) {
            const err = error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR })
        }
    }


    async getMostAppliedJobs(req:Request,res:Response){
        try {
            const companyId=req.params.id
            const response=await this._companyDashboardService.getMostAppliedJobs(companyId)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:err.message||ERROR_MESSAGES.SERVER_ERROR})
        }
    }
}