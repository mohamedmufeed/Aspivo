import { Request, Response } from "express";
import ICompanyMeetingController from "../../interface/controller/company/comapnyMeetingController";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/error";
import IComapnyMeetingService from "../../interface/service/company/meetingInterface";

export class ComapnyMeetingController implements ICompanyMeetingController {
    constructor(private _companyMeetingService: IComapnyMeetingService) { }

    sheduleMeeting = async (req: Request, res: Response) => {
        try {
            const meetingData = req.body
            const response = await this._companyMeetingService.scheduleMeeting(meetingData)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err= error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR })
        }
    }
    getMeetings = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id
            const response = await this._companyMeetingService.getMeetings(companyId)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            const err=error as Error
            res.status(500).json({ message: err.message ||ERROR_MESSAGES.SERVER_ERROR })
        }
    }
}