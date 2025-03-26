import  express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/user/stripeController.js";

const router=express.Router()
router.post("/create-checkout-session",createCheckoutSession)
router.post("/webhook", express.raw({ type: "application/json" }),handleWebhook);
export default router