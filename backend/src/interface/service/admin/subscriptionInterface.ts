import { ISubscription } from "../../../models/Subscription";
import { SubscriptionResponse } from "../../../types/interfaceTypes";
export default interface ISubscriptionSerice{
    getSubcriptions():Promise<{subscription:ISubscription[], message:string}>
    updateSubscriptionStatus(subscriptionId:string,status:string):Promise<SubscriptionResponse>
}