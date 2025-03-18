import { NotificationRepository } from "../repositories/notificationRepository.js";

const notificationRepository = new NotificationRepository();

export class NotificationService {
    async createNotification(userId: string, message: string) {
        return await notificationRepository.createNotification(userId, message);
    }
    async getNotifications(userId:string){
        return await notificationRepository.getNotifications(userId)
    }
}