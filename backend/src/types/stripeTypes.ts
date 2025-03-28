export type SubscriptionTypes = {
    subscriptionId: string;
    status: string;
    plan?: string;
    amount?: number;
  };
  
export type SubscriptionData = {
    userId: string;
    companyId?: string | null;
    subscriptionId: string;
    plan?: string;
    amount?: string|number;
    status: string
  };
  