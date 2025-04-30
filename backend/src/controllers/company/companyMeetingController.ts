import { Request, Response } from "express";
import ICompanyMeetingController from "../../interface/controller/company/comapnyMeetingController";
import { CompanyMeetingService } from "../../services/compnyService/companyMeetingService";
import HttpStatus from "../../utils/httpStatusCode";
import { assert, log } from "console";
import { ERROR_MESSAGES } from "../../constants/error";
import { GetPaginationQuery } from "../../types/userTypes";

export class ComapnyMeetingController implements ICompanyMeetingController {
    constructor(private _companyMeetingService: CompanyMeetingService) { }

    sheduleMeeting = async (req: Request, res: Response) => {
        try {
            const meetingData = req.body
            const response = await this._companyMeetingService.scheduleMeeting(meetingData)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR })
        }
    }
    getMeetings = async (req: Request, res: Response) => {
        try {
            const companyId = req.params.id
            const response = await this._companyMeetingService.getMeetings(companyId)
            res.status(HttpStatus.OK).json(response)
        } catch (error) {
            res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR })
        }
    }
}