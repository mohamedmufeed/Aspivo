import  express from "express";
import { StripeController } from "../controllers/user/stripeController";

const router=express.Router()
const stripeController = new StripeController();
router.post("/create-checkout-session",stripeController.createCheckoutSession)
router.post("/webhook", express.raw({ type: "application/json" }),stripeController.handleWebhook);
export default router