import { Document } from "mongoose";
import Subscription from "../../models/Subscription";
import { User } from "../../types/userTypes";
import { Company } from "../../types/companyTypes";
import { ISubscription } from "../../types/userTypes";

export default interface IAdminRepostry {
  getAllUsers(): Promise<  User[]>;
  findById(id: string): Promise<  User | null>;
  findAllCompany(): Promise<  Company[]>;
  findComapny(companyId: string): Promise<  Company | null>;
  findApprovedCompany(): Promise<  Company[]>;
  findSubscriptions(): Promise<  ISubscription[]>;
  findSubscriptionById(subscriptionId: string): Promise<  ISubscription | null>;
}
