
import  { ISubscription } from "../../models/Subscription";
import { GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetSubscriptionResponse, GetUsersResponse } from "../../types/userTypes";
import { IUser } from "../../models/user";
import { CompanyDocument } from "../../models/company";

export default interface IAdminRepostry {
  getAllUsers({ page, limit, searchQuery }: GetPaginationQuery): Promise<  GetUsersResponse>;
  findById(id: string): Promise<  IUser | null>;
  findAllCompany({page, limit, searchQuery}:GetPaginationQuery): Promise< GetCompanyResponse>;
  findComapny(companyId: string): Promise<  CompanyDocument|null >;
  findByIdAndUpdateStatus(companyId:string,status:string):Promise<CompanyDocument|null>
  findApprovedCompany({page,limit,searchQuery}:GetPaginationQuery): Promise< GetApprovedCompanyResponse>;
  findSubscriptions({page,limit,searchQuery}:GetPaginationQuery): Promise<  GetSubscriptionResponse>;
  findSubscriptionById(subscriptionId: string): Promise<  ISubscription | null>;
}
