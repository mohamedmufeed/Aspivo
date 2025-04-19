import { Request, Response } from "express";
import { SubscriptionService } from "../../services/adminService/subscriptionService";
import HttpStatus from "../../utils/httpStatusCode";
import ISubscriptionController from "../../interface/controller/admin/subscriptionControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";

export class SubscriptionController  implements ISubscriptionController{
  constructor(private _subscriptionService: SubscriptionService) {}

  getSubscriptions = async (req: Request, res: Response) => {
    try {
      const response = await this._subscriptionService.getSubcriptions();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error fetching subscriptions:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR});
    }
  };

  updateSubscriptionStatus = async (req: Request, res: Response) => {
    try {
      const subscriptionId = req.params.id;
      const { status } = req.body;
      const response = await this._subscriptionService.updateSubscriptionStatus(
        subscriptionId,
        status
      );
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error updating subscription status:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message:ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
