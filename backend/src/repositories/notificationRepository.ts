import Notification from "../models/notification.js";
import mongoose from "mongoose";
 export class NotificationRepository {
  async createNotification(userId: string, message: string) {
    return await Notification.create({ userId, message });
  }


  async getNotifications(userId:string){
    return await Notification.find({userId})
  }
}