import { AdminRepostry } from "../../repositories/adminRepositories";

export class SubscriptionService {
  constructor(private subscriptionRepository: AdminRepostry) {}
  async getSubcriptions() {
    const subscription =
      await this.subscriptionRepository.findSubscriptions();
    return { subscription, message: "Subscription fetch sucess full" };
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    const subscription =
      await this.subscriptionRepository.findSubscriptionById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");
    if (!status) throw new Error("Status not found");
    subscription.status = status || subscription.status;
    await subscription.save()
    return {subscription , message:"Subscription status updated sucess fully"}
  }
}
