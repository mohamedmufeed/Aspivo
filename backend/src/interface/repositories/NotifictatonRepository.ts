import { INotification, NotificationDocument } from "../../models/notification";

export interface INotificationRepository {
    createNotification(userId: string, message: string): Promise<NotificationDocument>;
    getNotifications(userId: string): Promise<NotificationDocument[]>;
    updateNotification(notificationId: string, updateData: Partial<INotification>): Promise<NotificationDocument|null>;
  }
  