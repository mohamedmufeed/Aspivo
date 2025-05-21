import { Request, Response } from "express";
import { NotificationService } from "../../services/notificationService";
import HttpStatus from "../../utils/httpStatusCode";
import { INotificationController } from "../../interface/controller/user/notificationControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import INotificationService from "../../interface/service/user/notificationService";

export class NotificationController implements INotificationController {
  constructor(private _notificationService:INotificationService) {}

  public createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, message } = req.body;
      const notification = await this._notificationService.createNotification(userId, message);
      res.status(HttpStatus.CREATED).json(notification);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: `Failed to create notification${err.message}` });
    }
  };

  public getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const notifications = await this._notificationService.getNotifications(userId);
      res.status(HttpStatus.OK).json(notifications);
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR|| err.message });
    }
  };

  public isRead = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { notificationId } = req.body;
      const response = await this._notificationService.isRead(userId, notificationId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err=error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message});
    }
  };
}
