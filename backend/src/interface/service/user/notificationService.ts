import { INotification } from "../../../models/notification";

export default interface INotificationService {
    createNotification(userId: string, message: string): Promise<INotification>;
    getNotifications(userId: string): Promise<INotification[]>;
    isRead(userId: string, notificationId: string): Promise<{updatedNotification:INotification[], message:string}>;
  }
  