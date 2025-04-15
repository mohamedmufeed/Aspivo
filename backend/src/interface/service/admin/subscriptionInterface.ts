import { SubscriptionResponse } from "../../../types/interfaceTypes";


export default interface ISubscriptionSerice{
    getSubcriptions():SubscriptionResponse
    updateSubscriptionStatus():SubscriptionResponse
}