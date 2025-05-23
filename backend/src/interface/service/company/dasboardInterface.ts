import { IMostAppliedJobs } from "../../../types/companyTypes";
import {  CompanyDashboardStats, StatResult } from "../../../types/dashboardTypes";

export interface ICompanyDashboardService{
        calculateStats(total:number,last:number):StatResult
        getComapnyDashboardStats(companyId:string):Promise<CompanyDashboardStats>
        getApplicationStatusByDate(companyId:string,start:string,end:string):Promise<{shortlisted:number,hired:number,rejected:number}>
        getMostAppliedJobs(companyId:string):Promise<{response:IMostAppliedJobs[], message:string}>
}