import { Request, Response } from "express";
import { SubscriptionService } from "../../services/adminService/subscriptionService";
import HttpStatus from "../../utils/httpStatusCode";
import ISubscriptionController from "../../interface/controller/admin/subscriptionControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import { GetPaginationQuery } from "../../types/userTypes";
import logger from "../../logger";

export class SubscriptionController implements ISubscriptionController {
  constructor(private _subscriptionService: SubscriptionService) { }

  getSubscriptions = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 1, q = "" } = req.query
      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(q)

      }
      const result = await this._subscriptionService.getSubcriptions(query);
      res.status(HttpStatus.OK).json({
        sucsess: true,
        subscription: result.subscription,
        totalSubscription: result.totalSubscription,
        totalPages: result.totalPages,
        message: "Subscription fetching successful"
      });
    } catch (error) {
   logger.error("Error fetching subscriptions:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
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
      logger.error("Error updating subscription status:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
