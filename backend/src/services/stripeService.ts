import Stripe from "stripe";
import { StripeRepositories } from "../repositories/stripeRepositories";
import logger from "../logger";
import { http } from "winston";
import HttpStatus from "../utils/httpStatusCode";
import { IStripeService } from "../interface/service/user/stripeServiceInterface";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export class StripeService implements IStripeService {
  private _stripeRepositories: StripeRepositories;

  constructor() {
    this._stripeRepositories = new StripeRepositories();
  }

  async setupStripe(userId: string, companyId: string) {
    if (!userId) throw { status: HttpStatus.NOT_FOUND, message: "User id is required" };
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
      success_url: "https://aspivo.site/payment-success",
      cancel_url: "https://aspivo.site/payment-cancel",
      metadata: {
        userId: userId.toString(),
        companyId: companyId || "",
      },
      subscription_data: {
        metadata: {
          userId: userId.toString(),
          companyId: companyId || "",
        },
      },
    });
    return { url: session.url };
  }

  async handleWebhookEvent(event: Stripe.Event) {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const userIdSession = session.metadata?.userId;
          const companyIdSession = session.metadata?.companyId;

          if (!userIdSession) {
            logger.error("Missing userId in checkout session metadata")
            return;
          }
          if (session.subscription) {
            try {
              if (session.subscription && typeof session.subscription === "string") {
                await stripe.subscriptions.update(session.subscription, {
                  metadata: {
                    userId: userIdSession,
                    companyId: companyIdSession || "",
                  },
                });
              }
            } catch (error) {
              logger.error(`Failed to update subscription metadata for ${session.subscription}:`, error)
              throw new Error(`Failed to update subscription metadata: ${error}`);
            }
          }
          const amount = session.amount_total !== null ? session.amount_total / 100 : 0;
          const subscriptionId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription?.id || "";

          if (!subscriptionId) {
            throw new Error("Missing subscription ID");
          }

          await this._stripeRepositories.storeSubscription({
            subscriptionId: subscriptionId,
            userId: userIdSession,
            companyId: companyIdSession || null,
            status: "active",
            amount: amount,
            plan: process.env.STRIPE_PRICE_ID || "",
          });

          await this._stripeRepositories.updateUserSubscription(userIdSession, {
            subscriptionId: subscriptionId,
            status: "active",
            amount: amount
          });

          if (companyIdSession) {

            await this._stripeRepositories.updateCompanySubscription(
              companyIdSession,
              {
                subscriptionId: subscriptionId,
                status: "active",
                amount: amount
              }
            );
          }
          break;

        case "customer.subscription.updated":
          const updatedSubscription = event.data.object;
          const userIdUpdated = updatedSubscription.metadata?.userId;
          const companyIdUpdated = updatedSubscription.metadata?.companyId;

          if (!userIdUpdated) {
            logger.error("Missing userId in subscription metadata during update")
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
            logger.error("Missing userId in subscription metadata during deletion")
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
              logger.info("Falling back to invoice metadata...")
              userIdPayment = invoice.metadata?.userId;
              companyIdPayment = invoice.metadata?.companyId;
            }

            if (!userIdPayment) {
              logger.error("Metadata missing, retrying after 2 seconds...")
              await new Promise((resolve) => setTimeout(resolve, 2000));
              const retrySubscription = await stripe.subscriptions.retrieve(invoice.subscription);
              userIdPayment = retrySubscription.metadata?.userId;
              companyIdPayment = retrySubscription.metadata?.companyId;
            }
          }

          if (!userIdPayment) {
            logger.error("Missing userId in both subscription and invoice metadata")
            return;
          }

          await this._stripeRepositories.grantUserFeatures(userIdPayment);
          if (companyIdPayment) {
            await this._stripeRepositories.grantCompanyFeatures(companyIdPayment);
          }
          break;

        case "charge.succeeded":
          logger.info("Charge succeeded:", event.data.object.id)
          break;

        case "charge.updated":
          const charge = event.data.object;
          if (charge.status === "succeeded") {
            logger.info("Charge succeeded for:", charge.payment_intent)
          } else if (charge.status === "failed") {
            logger.info("Charge failed:", charge.payment_intent)
          }
          break;

      
        default:
          logger.info(`Unhandled event type ${event.type}`)
      }
    } catch (error) {
      throw new Error(`Error handling webhook event: ${error}\n${error}`);
    }
  }
}