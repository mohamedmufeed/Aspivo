import { Request, Response } from "express";

export default interface IDashboardController{
    getStats(req:Request, res:Response):Promise<void>
}