
import { Request,Response } from "express"
export default interface ICompanyMeetingController{
    sheduleMeeting(req:Request,res:Response):Promise<void>
    getMeetings(req:Request,res:Response):Promise<void>
}