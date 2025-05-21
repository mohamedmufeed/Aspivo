import { IMeeting } from "../../models/meeting";
import { IMeetingData } from "../../types/companyTypes";

export interface ICompanyMeetingRepositories{
    createMeeting(data:IMeetingData):Promise<IMeetingData>
    findAllMeetings(companyId:string):Promise<IMeeting[]>
}