
import  { ISubscription } from "../../models/Subscription";
import { GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetSubscriptionResponse, GetUsersResponse } from "../../types/userTypes";
import { IUser, UserDocument } from "../../models/user";
import { CompanyDocument, ICompany } from "../../models/company";
import { Types } from "mongoose";


export default interface IAdminRepostry {
  getAllUsers({ page, limit, searchQuery }: GetPaginationQuery): Promise<  GetUsersResponse>;
  findById(id: string): Promise<  UserDocument|null>;
  findByIdAndUpdateBlockStatus(id:string,blockStatus:boolean):Promise<UserDocument|null>
  findAllCompany({page, limit, searchQuery}:GetPaginationQuery): Promise< GetCompanyResponse>;
  findComapny(companyId: string): Promise<  CompanyDocument|null >;
  findByIdAndUpdateStatus(companyId:string,status:string):Promise<CompanyDocument|null>
  findApprovedCompany({page,limit,searchQuery}:GetPaginationQuery): Promise< GetApprovedCompanyResponse>;
  findSubscriptions({page,limit,searchQuery}:GetPaginationQuery): Promise<  GetSubscriptionResponse>;
  findSubscriptionByIdAndUpdate(subscriptionId: string, status:string): Promise<  ISubscription | null>;
  updateUserFeatures(userId: Types.ObjectId, features: { unlockAiFeatures: boolean, unlimitedChat: boolean }):Promise<IUser|null>
  updateCompanyFeatures(userId: Types.ObjectId, features: { unlimitedJobPosting: boolean, accessToAnalytics: boolean }):Promise<ICompany|null>
  findByIdAndUpdateCompanyBlockStatus(comapnyId: string, blockStatus: boolean):Promise<CompanyDocument|null>
}
