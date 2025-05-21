import { Request, Response } from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import { StripeService } from "../../services/stripeService";
import HttpStatus from "../../utils/httpStatusCode";
import { IStripeService } from "../../interface/service/user/stripeServiceInterface";

dotenv.config();

export class StripeController {
  private _stripeService: IStripeService;
  private _stripe: Stripe;

  constructor() {
    this._stripeService = new StripeService();
    this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2025-02-24.acacia",
    });
  }

  public createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, companyId } = req.body;
      const response = await this._stripeService.setupStripe(userId, companyId);
      res.status(HttpStatus.OK).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || "Internal server error",
      });
    }
  };

  public handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(HttpStatus.BAD_REQUEST).send("Webhook Error: Stripe-Signature header is missing");
      return;
    }

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      const event = this._stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      await this._stripeService.handleWebhookEvent(event);
      res.status(HttpStatus.OK).json({ received: true });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${error}`);
    }
  };
}
