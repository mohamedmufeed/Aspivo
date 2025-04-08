import { AdminRepostry } from "../../repositories/adminRepositories.js";

export class SubscriptionService {
  private subscriptionRespostries = new AdminRepostry();
  async getSubcriptions() {
    const subscriptions =
      await this.subscriptionRespostries.findSubscriptions();
    return { subscriptions, message: "Subscription fetch sucess full" };
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    const subscription =
      await this.subscriptionRespostries.findSubscriptionById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");
    if (!status) throw new Error("Status not found");
    subscription.status = status || subscription.status;
    await subscription.save()
    return {subscription , message:"Subscription status updated sucess fully"}
  }
}
