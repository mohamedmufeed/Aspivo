import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
const notificationService = new NotificationService();
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    const notification = await notificationService.createNotification(
      userId,
      message
    );
    res.status(HttpStatus.CREATED).json(notification);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to create notification" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(HttpStatus.OK).json(notifications);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

export const isRead = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { notificationId } = req.body;
    const response = await notificationService.isRead(userId, notificationId);
    res.status(HttpStatus.OK).json(response );
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server error"})
  }
};
