
export interface ICompanyType {
    _id: string; 
    companyName: string;
    email: string;
    location?: string;
    description?: string;
    companyUrl?: string;
    logo: string;
    kyc: string;
    userId: string; 
    status: "Pending" | "Approved" | "Declined";
    stack: string[];
    startDate?: Date;
    industry?: string;
    contact: {
      name?: string;
      url?: string;
    }[];
    employees?: string;
    customerId?: string;
    subscription?: {
      subscriptionId?: string;
      status?: string;
      plan?: string;
    };
    features: {
      unlimitedJobPosting: boolean;
      accessToAnalytics: boolean;
    };
    jobLimit: number;
    team: {
      position: string;
      name: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }
  