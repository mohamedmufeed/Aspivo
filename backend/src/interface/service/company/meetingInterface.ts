import { IMeetingData } from "../../../types/companyTypes"
import { FetchingMeetinngResposes, MeetinngRespose } from "../../../types/interfaceTypes"
export default interface IComapnyMeetingService{
    scheduleMeeting(meetingData:IMeetingData):Promise<MeetinngRespose>
    getMeetings(companyId:string):Promise<FetchingMeetinngResposes>
}