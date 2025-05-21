import Stripe from "stripe";

export interface IStripeService{
    setupStripe(userId:string,companyId:string): Promise<{ url: string|null }>
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
}