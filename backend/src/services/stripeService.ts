import Stripe from "stripe";
import { StripeRepositories } from "../repositories/stripeRepositories";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export class StripeService {
  private stripeRepositories: StripeRepositories;

  constructor() {
    this.stripeRepositories = new StripeRepositories();
  }

  async setupStripe(userId: string, companyId: string) {
    if (!userId) throw { status: 404, message: "User id is required" };
    if (companyId) {
      await this.stripeRepositories.verifyCompany(userId, companyId);
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
        metadata: {
          userId: userId.toString(),
          companyId: companyId || "",
        },
   
    });
    return { url: session.url };
  }

  async handleWebhookEvent(event: any) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const userIdSession = session.metadata?.userId;
          const companyIdSession = session.metadata?.companyId;

          if (!userIdSession) {
            console.log("Missing userId in checkout session metadata");
            return;
          }
          await this.stripeRepositories.storeSubscription({
            subscriptionId: session.subscription,
            userId: userIdSession,
            companyId: companyIdSession || null,
            status: "active",
            amount: session.amount_total / 100,
            plan: process.env.STRIPE_PRICE_ID || "",
          });

          await this.stripeRepositories.updateUserSubscription(userIdSession, {
            subscriptionId: session.subscription,
            status: "active",
            amount: session.amount_total / 100,
          });

          if (companyIdSession) {
            await this.stripeRepositories.updateCompanySubscription(
              companyIdSession,
              {
                subscriptionId: session.subscription,
                status: "active",
                amount: session.amount_total / 100,
              }
            );
          }
          break;

        case "customer.subscription.updated":
          const updatedSubscription = event.data.object;
          const userIdUpdated = updatedSubscription.metadata?.userId;
          const companyIdUpdated = updatedSubscription.metadata?.companyId;

          if (!userIdUpdated) {
            console.log(
              "Skipping customer.subscription.updated event: Missing userId in metadata"
            );
            return;
          }

          await this.stripeRepositories.updateUserSubscription(userIdUpdated, {
            subscriptionId: updatedSubscription.id,
            status: updatedSubscription.status,
            plan: updatedSubscription.items.data[0].price.id,
          });

          if (companyIdUpdated) {
            await this.stripeRepositories.updateCompanySubscription(
              companyIdUpdated,
              {
                subscriptionId: updatedSubscription.id,
                status: updatedSubscription.status,
                plan: updatedSubscription.items.data[0].price.id,
              }
            );
          }

          await this.stripeRepositories.updateSubscriptionStatus(
            updatedSubscription.id,
            updatedSubscription.status
          );
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object;
          const userIdDeleted = deletedSubscription.metadata?.userId;
          const companyIdDeleted = deletedSubscription.metadata?.companyId;

          if (!userIdDeleted) {
            console.log(
              "Skipping customer.subscription.deleted event: Missing userId in metadata"
            );
            return;
          }

          await this.stripeRepositories.revokeUserFeatures(userIdDeleted);

          if (companyIdDeleted) {
            await this.stripeRepositories.revokeCompanyFeatures(
              companyIdDeleted
            );
          }
          await this.stripeRepositories.updateSubscriptionStatus(
            deletedSubscription.id,
            deletedSubscription.status
          );
          console.log("Subscription canceled:", deletedSubscription.id);
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          const subscriptionDetails = invoice.subscription_details;
          const userIdPayment = subscriptionDetails?.metadata?.userId;
          const companyIdPayment = subscriptionDetails?.metadata?.companyId;

          if (!userIdPayment) {
            console.log(
              "Skipping invoice.payment_succeeded event: Missing userId in subscription metadata"
            );
            return;
          }

          await this.stripeRepositories.grantUserFeatures(userIdPayment);
          if (companyIdPayment) {
            await this.stripeRepositories.grantCompanyFeatures(
              companyIdPayment
            );
          }
          break;
        case "charge.updated":
          const charge = event.data.object;
          if (charge.status === "succeeded") {
            console.log("Charge succeeded for:", charge.payment_intent);
          } else if (charge.status === "failed") {
            console.log("Charge failed:", charge.payment_intent);
          }
          break;

        case "invoice.payment_failed":
          console.log("Payment failed for invoice:", event.data.object.id);
          break;

        default:
          // console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Error handling webhook event: ${error}\n${error}`);
    }
  }
}
