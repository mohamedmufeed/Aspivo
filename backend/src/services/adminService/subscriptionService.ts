import ISubscriptionSerice from "../../interface/service/admin/subscriptionInterface";
import { ISubscription } from "../../models/Subscription";
import { AdminRepostry } from "../../repositories/adminRepositories";
import { GetPaginationQuery, GetSubscriptionResponse } from "../../types/userTypes";

export class SubscriptionService  implements ISubscriptionSerice{
  constructor(private _subscriptionRepository: AdminRepostry) {}
  async getSubcriptions(query:GetPaginationQuery):Promise<GetSubscriptionResponse> {
     return await this._subscriptionRepository.findSubscriptions(query);
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string):Promise<{subscription:ISubscription,message:string}> {
    const subscription =
      await this._subscriptionRepository.findSubscriptionById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");
    if (!status) throw new Error("Status not found");
    subscription.status = status || subscription.status;
    await subscription.save()
    return {subscription , message:"Subscription status updated sucess fully"}
  }
}
