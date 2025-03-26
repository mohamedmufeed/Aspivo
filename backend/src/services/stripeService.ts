import Stripe from "stripe";
import { StripeRepositories } from "../repositories/stripeRepositories.js";
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

  async handleWebhookEvent(event:any) {
    try {
      switch (event.type) {
        case "customer.subscription.created":
          const subscription = event.data.subscription;
          const userIdCreated = event.data.object.metadata.userId;
          const companyIdCreated = event.data.object.metadata.companyId;

          if (userIdCreated) {
            await this.stripeRepositories.updateUserSubscription(
              userIdCreated,
              {
                subscriptionId: subscription.id,
                status: subscription.status,
                plan: subscription.items.data[0].price.id,
              }
            );

            if (companyIdCreated) {
              await this.stripeRepositories.updateCompanySubscription(
                companyIdCreated,
                {
                  subscriptionId: subscription.id,
                  status: subscription.status,
                  plan: subscription.items.data[0].price.id,
                }
              );
            }

            await this.stripeRepositories.storeSubscription({
              userId: userIdCreated,
              companyId: companyIdCreated,
              subscriptionId: subscription.id,
              plan: subscription.items.data[0].price.id,
              amount: subscription.items.data[0].price.unit_amount / 100,
              startDate: new Date(subscription.start_date * 1000),
              status: subscription.status,
            });

            console.log("Subscription created:", subscription.id);
          }
          break;
        case "customer.subscription.updated": {
          const updatedSubscription = event.data.object;
          const userIdUpdated = event.data.object.metadata.userId;
          const companyIdUpdated = event.data.object.metadata.companyId;

          if (userIdCreated) {
            await this.stripeRepositories.updateUserSubscription(
              userIdUpdated,
              {
                subscriptionId: updatedSubscription.id,
                status: updatedSubscription.status,
                plan: updatedSubscription.items.data[0].price.id,
              }
            );

            if (companyIdUpdated) {
              await this.stripeRepositories.updateCompanySubscription(
                companyIdCreated,
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
            console.log("Subscription updated:", updatedSubscription.id);
          }
          break;
        }
        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object;
          const userIdDeleted = event.data.object.metadata.userId;
          const companyIdDeleted = event.data.object.metadata.companyId;

          if (userIdDeleted) {
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
          }
          break;
        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          const userIdPayment = event.data.object.metadata.userId;
          const companyIdPayment = event.data.object.metadata.companyId;
          if (userIdCreated) {
            await this.stripeRepositories.grantUserFeatures(userIdPayment);
            console.log("User features granted to user:", userIdPayment);

            if (companyIdPayment) {
              await this.stripeRepositories.grantCompanyFeatures(
                companyIdPayment
              );
              console.log(
                "Company features granted to company:",
                companyIdPayment
              );
            }
            console.log("Payment succeeded for invoice:", invoice.id);
          }
          break;
        case "invoice.payment_failed":
          console.log("Payment failed for invoice:", event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Error handling webhook event: ${error}`);
    }
  }
}
