
import { NO_NOTIFICATION_FOUND_TO_UPDATE, NOTIFICATION_UPDATED_SUCCESSFULLY } from "../constants/message";
import { INotificationRepository } from "../interface/repositories/NotifictatonRepository";
import INotificationService from "../interface/service/user/notificationService";
import { INotification } from "../models/notification";
import { NotificationRepository } from "../repositories/notificationRepository";




export class NotificationService  implements INotificationService{
    constructor(private _notificationRepositories: INotificationRepository) {}

  async createNotification(userId: string, message: string):Promise<INotification> {
    return await this._notificationRepositories.createNotification(userId, message);
  }

  async getNotifications(userId: string):Promise<INotification[]> {
    return await this._notificationRepositories.getNotifications(userId);
  }


  async isRead(userId: string, notificationId: string):Promise<{updatedNotification:INotification[], message:string}> {
    const userNotifications = await this._notificationRepositories.getNotifications(userId);

    const notificationToUpdate =  userNotifications.find(
      (notification) => notification.id === notificationId
    );

    if (!notificationToUpdate) {
      throw new Error(NO_NOTIFICATION_FOUND_TO_UPDATE);
    }
    await this._notificationRepositories.updateNotification(notificationId,{isRead:true})
    const updatedNotification=  await this._notificationRepositories.getNotifications(userId)
    return { updatedNotification ,message:NOTIFICATION_UPDATED_SUCCESSFULLY};
  }
}
