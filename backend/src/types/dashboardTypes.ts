 export interface StatResult {
    total: number;
    lastWeek: number;
    diff: number;
    direction: string;
    percentage: string;
  }
  
   export interface DashboardStats {
    users: StatResult;
    jobs: StatResult;
    companies: StatResult;
  }
   export interface CompanyDashboardStats {
    applications: StatResult;
    jobs: StatResult;
    numberOfHirings: StatResult;
  }
  
   export interface WeeklyData {
    name: string;
    applications: number;
    interviews: number;
    pending: number;
    rejected: number;
  }

   export interface MonthlyData{
    name:string;
    subscription:number
   }
  

   export type ApplicationStatusStats = {
    _id: "pending" | "reviewed" | "accepted" | "rejected";
    count: number;
  };