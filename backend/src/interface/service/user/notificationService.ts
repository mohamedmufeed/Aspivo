export default interface INotificationService {
    createNotification(userId: string, message: string): Promise<any>;
    getNotifications(userId: string): Promise<any[]>;
    markAsRead(userId: string, notificationId: string): Promise<any>;
  }
  