import { Request, Response } from "express";
import {NotificationService} from "../../services/notificationService.js"
const notificationService = new NotificationService()
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.createNotification(userId, message);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};