import Notification from "../models/notification.js";

 export class NotificationRepository {
  async createNotification(userId: string, message: string) {
    return await Notification.create({ userId, message });
  }
}