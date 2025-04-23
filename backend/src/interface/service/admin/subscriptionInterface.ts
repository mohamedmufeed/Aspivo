
import { SubscriptionResponse } from "../../../types/interfaceTypes";
import { GetPaginationQuery, GetSubscriptionResponse } from "../../../types/userTypes";
export default interface ISubscriptionSerice{
    getSubcriptions(query:GetPaginationQuery):Promise<GetSubscriptionResponse>
    updateSubscriptionStatus(subscriptionId:string,status:string):Promise<SubscriptionResponse>
}