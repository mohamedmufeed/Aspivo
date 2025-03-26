export interface SubscriptionTypes{
    subscriptionId:string;
    status:string;
    plan:string
}
export type SubscriptionData = {
    userId: string;
    companyId?: string | null;
    subscriptionId: string;
    plan: string;
    amount: number;
    startDate: Date;
    status: string
  };
  