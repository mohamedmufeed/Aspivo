import { Request, Response } from "express";
import dotenv from "dotenv";
import { StripeService } from "../../services/stripeService.js";
import Stripe from "stripe";

dotenv.config();
const stripeService = new StripeService();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { userId, companyId } = req.body;
    const response = await stripeService.setupStripe(userId, companyId);
    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  console.log("Webhook received with headers:", req.headers);
  console.log("Webhook body:", req.body);

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).send("Webhook Error: Stripe-Signature header is missing");
    return; 
  }

  const signature = Array.isArray(sig) ? sig[0] : sig;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(500).send("Webhook Error: STRIPE_WEBHOOK_SECRET is not defined");
    return; 
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return; 
  }

  try {
    await stripeService.handleWebhookEvent(event);
    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};