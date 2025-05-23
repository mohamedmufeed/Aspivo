import IAdminRepostry from "../../interface/repositories/adminRepository";
import ISubscriptionSerice from "../../interface/service/admin/subscriptionInterface";
import { ISubscription } from "../../models/Subscription";
import { AdminRepostry } from "../../repositories/adminRepositories";
import { GetPaginationQuery, GetSubscriptionResponse } from "../../types/userTypes";

export class SubscriptionService implements ISubscriptionSerice {
  constructor(private _subscriptionRepository: IAdminRepostry) { }
  async getSubcriptions(query: GetPaginationQuery): Promise<GetSubscriptionResponse> {
  return await this._subscriptionRepository.findSubscriptions(query);
    //  const mappedSubscription={}

  }

  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<{ subscription: ISubscription, message: string }> {
    if (!status) throw new Error("Status not found");
    const subscription = await this._subscriptionRepository.findSubscriptionByIdAndUpdate(subscriptionId, status);
    if (!subscription) throw new Error("Subscription not found");
    if (status === "inactive") {
      await this._subscriptionRepository.updateUserFeatures(subscription.userId, {
        unlockAiFeatures: false,
        unlimitedChat: false,
      })
      if (subscription.companyId) {
        await this._subscriptionRepository.updateCompanyFeatures(subscription.companyId, {
          unlimitedJobPosting: false,
          accessToAnalytics: false,
        })
      }

    } else if (status === "active") {
      await this._subscriptionRepository.updateUserFeatures(subscription.userId, {
        unlockAiFeatures: true,
        unlimitedChat: true,
      })
      if (subscription.companyId) {
        await this._subscriptionRepository.updateCompanyFeatures(subscription.companyId, {
          unlimitedJobPosting: true,
          accessToAnalytics: true,
        })
      }

    }
    return { subscription, message: "Subscription status updated sucess fully" }
  }
}
