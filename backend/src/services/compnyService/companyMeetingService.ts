
import IComapnyMeetingService from "../../interface/service/company/meetingInterface";
import { CompanyMeetingRepositories } from "../../repositories/coampanyMeetingRepositories";
import { sendNotification } from "../../server";
import { IMeetingData } from "../../types/companyTypes";
import { MeetinngRespose } from "../../types/interfaceTypes";
import { NotificationService } from "../notificationService";

export class CompanyMeetingService implements IComapnyMeetingService {
  constructor(
    private _meetingRepositories: CompanyMeetingRepositories,
    private _notificationService: NotificationService
  ) { }

  async scheduleMeeting(meetingData: IMeetingData): Promise<MeetinngRespose> {
    try {
      const meeting = await this._meetingRepositories.createMeeting(meetingData);
      this.scheduleNotification(meeting);
      return {
        meeting,
        message: "Meeting scheduled successfully",
      };
    } catch (error) {
      throw new Error("Failed to schedule meeting");
    }
  }

  private scheduleNotification(meeting: IMeetingData) {
    const now = new Date();
    const startTime = new Date(meeting.startTime);
    const notificationTime = new Date(startTime.getTime() - 3 * 60 * 1000);

    if (notificationTime > now) {
      const delay = notificationTime.getTime() - now.getTime();
      setTimeout(() => this.notifyParticipants(meeting), delay);
    }
  }

  private async notifyParticipants(meeting: IMeetingData) {
    const message = `Your meeting (${meeting.link}) starts in 3 minutes at ${new Date(meeting.startTime).toLocaleString()}`;
    await this._notificationService.createNotification(
      meeting.initiatorId.toString(),
      message
    );
    sendNotification("company", meeting.initiatorId.toString(), message);
    await this._notificationService.createNotification(
      meeting.targetId.toString(),
      message
    );
  }

  async getMeetings(companyId: string) {
    try {
      const meeting = await this._meetingRepositories.findAllMeetings(companyId)
      return { meeting, message: "Meetings fetched successfully" }
    } catch (error) {
      throw new Error("Failed to fetching meetings");
    }
  }
}