export interface INotificationRepository {
    createNotification(userId: string, message: string): Promise<any>;
    getNotifications(userId: string): Promise<any[]>;
    updateNotification(notificationId: string, updateData: object): Promise<void>;
  }
  