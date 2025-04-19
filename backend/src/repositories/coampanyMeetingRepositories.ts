import { BaseRepository } from "./baseRepository";
import { IMeetingData } from "../types/companyTypes";
import Meeting from "../models/meeting";
import { Mongoose, Types } from "mongoose";

export class CompanyMeetingRepositories extends BaseRepository<IMeetingData> {
  constructor() {
    super(Meeting);
  }

  async createMeeting(data: IMeetingData) {
    return this.create(data);
  }

  async findAllMeetings(companyId:string){
    return Meeting.find({initiatorId:companyId}).populate("targetId", " firstName lastName email profileImage")
    // return this.findAll({ initiatorId: new Types.ObjectId(companyId) })
  }
}