import { Request, Response } from "express";
import { SubscriptionService } from "../../services/adminService/subscriptionService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import ISubscriptionController from "../../interface/controller/admin/subscriptionControllerInterface.js";

export class SubscriptionController  implements ISubscriptionController{
  constructor(private subscriptionService: SubscriptionService) {}

  getSubscriptions = async (req: Request, res: Response) => {
    try {
      const response = await this.subscriptionService.getSubcriptions();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error fetching subscriptions:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  };

  updateSubscriptionStatus = async (req: Request, res: Response) => {
    try {
      const subscriptionId = req.params.id;
      const { status } = req.body;
      const response = await this.subscriptionService.updateSubscriptionStatus(
        subscriptionId,
        status
      );
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error updating subscription status:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server Error" });
    }
  };
}
