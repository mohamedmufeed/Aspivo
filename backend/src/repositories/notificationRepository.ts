import Notification, { INotification, NotificationDocument } from "../models/notification";
import mongoose from "mongoose";
import { BaseRepository } from "./baseRepository";
export class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor() {
    super(Notification)
  }
  async createNotification(userId: string, message: string) {
    return await Notification.create({ userId, message });
  }

  async getNotifications(userId: string) {
    return await Notification.find({ userId }).sort({ createdAt: -1 })
  }

  async updateNotification(notificationId: string, update: Partial<INotification>) {
    return await Notification.findByIdAndUpdate(notificationId, update, { new: true })
  }
}