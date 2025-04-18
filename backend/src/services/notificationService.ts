import { use } from "passport";
import { NotificationRepository } from "../repositories/notificationRepository";
import { INotificationRepository } from "../interface/repositories/NotifictatonRepository";

const notificationRepository = new NotificationRepository();

export class NotificationService {

  async createNotification(userId: string, message: string) {
    return await notificationRepository.createNotification(userId, message);
  }
  async getNotifications(userId: string) {
    return await notificationRepository.getNotifications(userId);
  }

  async isRead(userId: string, notificationId: string) {
    const userNotifications = await notificationRepository.getNotifications(userId);

    const notificationToUpdate =  userNotifications.find(
      (notification) => notification.id === notificationId
    );

    if (!notificationToUpdate) {
      throw new Error("No notification foudn to update");
    }
    await notificationRepository.updateNotification(notificationId,{isRead:true})
    const updatedNotification=  await notificationRepository.getNotifications(userId)
    return { updatedNotification ,message:"Notification updated sucsess fully"};
  }
}
