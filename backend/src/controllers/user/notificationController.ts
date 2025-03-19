import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService.js";
const notificationService = new NotificationService();
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.createNotification(
      userId,
      message
    );
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    console.log("notification fetching error");
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { notificationId } = req.body;
    const response = await notificationService.isRead(userId, notificationId);
    res.status(200).json(response );
  } catch (error) {
    console.log("Error updating notifivation",error)
    res.status(500).json({message:"Internal server error"})
  }
};
