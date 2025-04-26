import Stripe from "stripe";
import { StripeRepositories } from "../repositories/stripeRepositories";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export class StripeService {
  private _stripeRepositories: StripeRepositories;

  constructor() {
    this._stripeRepositories = new StripeRepositories();
  }

  async setupStripe(userId: string, companyId: string) {
    if (!userId) throw { status: 404, message: "User id is required" };
    if (companyId) {
      await this._stripeRepositories.verifyCompany(userId, companyId);
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
      // Add metadata to the invoice as a fallback
      subscription_data: {
        metadata: {
          userId: userId.toString(),
          companyId: companyId || "",
        },
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
          if (session.subscription) {
            try {
              await stripe.subscriptions.update(session.subscription, {
                metadata: {
                  userId: userIdSession,
                  companyId: companyIdSession || "",
                },
              });
          
            } catch (error) {
              console.error(`Failed to update subscription metadata for ${session.subscription}:`, error);
              throw new Error(`Failed to update subscription metadata: ${error}`);
            }
          }

          await this._stripeRepositories.storeSubscription({
            subscriptionId: session.subscription,
            userId: userIdSession,
            companyId: companyIdSession || null,
            status: "active",
            amount: session.amount_total / 100,
            plan: process.env.STRIPE_PRICE_ID || "",
          });

          await this._stripeRepositories.updateUserSubscription(userIdSession, {
            subscriptionId: session.subscription,
            status: "active",
            amount: session.amount_total / 100,
          });

          if (companyIdSession) {
            await this._stripeRepositories.updateCompanySubscription(
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
            console.log("Missing userId in subscription metadata during update");
            return;
          }

          await this._stripeRepositories.updateUserSubscription(userIdUpdated, {
            subscriptionId: updatedSubscription.id,
            status: updatedSubscription.status,
            plan: updatedSubscription.items.data[0].price.id,
          });

          if (companyIdUpdated) {
            await this._stripeRepositories.updateCompanySubscription(
              companyIdUpdated,
              {
                subscriptionId: updatedSubscription.id,
                status: updatedSubscription.status,
                plan: updatedSubscription.items.data[0].price.id,
              }
            );
          }

          await this._stripeRepositories.updateSubscriptionStatus(
            updatedSubscription.id,
            updatedSubscription.status
          );
          break;

        case "customer.subscription.deleted":
          const deletedSubscription = event.data.object;
          const userIdDeleted = deletedSubscription.metadata?.userId;
          const companyIdDeleted = deletedSubscription.metadata?.companyId;

          if (!userIdDeleted) {
            console.log("Missing userId in subscription metadata during deletion");
            return;
          }

          await this._stripeRepositories.revokeUserFeatures(userIdDeleted);

          if (companyIdDeleted) {
            await this._stripeRepositories.revokeCompanyFeatures(companyIdDeleted);
          }
          await this._stripeRepositories.updateSubscriptionStatus(
            deletedSubscription.id,
            deletedSubscription.status
          );
          break;

        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          let userIdPayment: string | undefined;
          let companyIdPayment: string | undefined;
          if (typeof invoice.subscription === "string") {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
            userIdPayment = subscription.metadata?.userId;
            companyIdPayment = subscription.metadata?.companyId;
            if (!userIdPayment) {
              console.log("Falling back to invoice metadata...");
              userIdPayment = invoice.metadata?.userId;
              companyIdPayment = invoice.metadata?.companyId;
            }

            if (!userIdPayment) {
              console.log("Metadata missing, retrying after 2 seconds...");
              await new Promise((resolve) => setTimeout(resolve, 2000)); 
              const retrySubscription = await stripe.subscriptions.retrieve(invoice.subscription);
              userIdPayment = retrySubscription.metadata?.userId;
              companyIdPayment = retrySubscription.metadata?.companyId;
            }
          }

          if (!userIdPayment) {
            console.log("Missing userId in both subscription and invoice metadata");
            return;
          }

          await this._stripeRepositories.grantUserFeatures(userIdPayment);
          if (companyIdPayment) {
            await this._stripeRepositories.grantCompanyFeatures(companyIdPayment);
          }
          break;

        case "charge.succeeded":
          console.log("Charge succeeded:", event.data.object.id);
          break;

        case "charge.updated":
          const charge = event.data.object;
          if (charge.status === "succeeded") {
            console.log("Charge succeeded for:", charge.payment_intent);
          } else if (charge.status === "failed") {
            console.log("Charge failed:", charge.payment_intent);
          }
          break;

        // case "payment_method.attached":
        //   console.log("Payment method attached:", event.data.object.id);
        //   break;

        // case "customer.created":
        //   console.log("Customer created:", event.data.object.id);
        //   break;

        // case "customer.updated":
        //   console.log("Customer updated:", event.data.object.id);
        //   break;

        // case "customer.subscription.created":
        //   console.log("Customer subscription created:", event.data.object.id);
        //   break;

        // case "payment_intent.succeeded":
        //   console.log("Payment intent succeeded:", event.data.object.id);
        //   break;

        // case "payment_intent.created":
        //   console.log("Payment intent created:", event.data.object.id);
        //   break;

        // case "invoice.created":
        //   console.log("Invoice created:", event.data.object.id);
        //   break;

        // case "invoice.finalized":
        //   console.log("Invoice finalized:", event.data.object.id);
        //   break;

        // case "invoice.updated":
        //   console.log("Invoice updated:", event.data.object.id);
        //   break;

        // case "invoice.paid":
        //   console.log("Invoice paid:", event.data.object.id);
        //   break;

        // case "invoice.payment_failed":
        //   console.log("Payment failed for invoice:", event.data.object.id);
        //   break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      throw new Error(`Error handling webhook event: ${error}\n${error}`);
    }
  }
}