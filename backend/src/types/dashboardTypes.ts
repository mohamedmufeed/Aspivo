 export interface StatResult {
    total: number;
    last: number;
    diff: number;
    direction: "↑" | "↓" | "→";
    percentage: string;
  }
  
   export interface DashboardStats {
    users: StatResult;
    jobs: StatResult;
    companies: StatResult;
  }
  