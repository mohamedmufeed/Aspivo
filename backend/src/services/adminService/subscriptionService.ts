import { STATUS_NOT_FOUND, SUBSCRIPTION_NOT_FOUND, SUBSCRIPTION_STATUS_UPDATED_SUCCESSFULLY } from "../../constants/message";
import IAdminRepostry from "../../interface/repositories/adminRepository";
import ISubscriptionSerice from "../../interface/service/admin/subscriptionInterface";
import { GetPaginationQuery, GetSubscriptionResponse } from "../../types/userTypes";
import { subscriptionStatusDto } from "../../utils/dto/adminDto";

export class SubscriptionService implements ISubscriptionSerice {
  constructor(private _subscriptionRepository: IAdminRepostry) { }
  async getSubcriptions(query: GetPaginationQuery): Promise<GetSubscriptionResponse> {
  return await this._subscriptionRepository.findSubscriptions(query);
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    if (!status) throw new Error(STATUS_NOT_FOUND);
    const subscription = await this._subscriptionRepository.findSubscriptionByIdAndUpdate(subscriptionId, status);
    if (!subscription) throw new Error(SUBSCRIPTION_NOT_FOUND);
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
    const subscriptionDto=subscriptionStatusDto(subscription)
    return { subscription:subscriptionDto, message:SUBSCRIPTION_STATUS_UPDATED_SUCCESSFULLY }
  }
}
