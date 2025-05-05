import { Request, Response } from "express";

export interface ICompanyDashboardController{
    getDashboardStatus(req:Request,res:Response):Promise<void>
    getApplicationStatusByDate(req:Request,res:Response):Promise<void>
}