import { AdminRepostry } from "../../repositories/adminRepositories";

import { sendNotification } from "../../server";
import IAdminService from "../../interface/service/admin/adminInterface";
import { NotificationRepository } from "../../repositories/notificationRepository";

import { GetApprovedCompanyResponse, GetCompanyResponse, GetPaginationQuery, GetUsersResponse } from "../../types/userTypes";
import { IUser } from "../../models/user";
import { CompanyDocument } from "../../models/company";

export class AdminService implements IAdminService {
  constructor(private _adminRepository: AdminRepostry, private _notificationRespository: NotificationRepository) { }

  async getAllCompanies(query:GetPaginationQuery): Promise<GetCompanyResponse> {
    return await this._adminRepository.findAllCompany(query);
  }
  async getAllUsers(query: GetPaginationQuery): Promise<GetUsersResponse> {
    return await this._adminRepository.getAllUsers(query);
  }

  async blockUser(id: string): Promise<{ user: IUser, message: string }> {
    const user = await this._adminRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    await user.save();
    return { user, message: "User status changed successfully" };
  }

  async handleCompanyRequest(companyId: string, action: string): Promise<{ company: CompanyDocument, message: string }> {
    const existingcompany = await this._adminRepository.findComapny(companyId);
    if (!existingcompany) throw new Error("Company not found");
    let status = ""
    if (action === "Approved") {
      status = action || "Approved";
    } else if (action === "Declined") {
      status = action || "Declined";
    } else {
      status = "Pending";
    }
    const company= await this._adminRepository.findByIdAndUpdateStatus(companyId, status)
    if(!company) throw new Error("Comapny Not found or Eror in updaing status")
    const message = `Your company '${company.companyName}' has been ${action}!`;
    await this._notificationRespository.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    return { company, message: "Company status changed successfully" };
  }

  async approvedCompany(query:GetPaginationQuery): Promise<GetApprovedCompanyResponse> {
     return  await this._adminRepository.findApprovedCompany(query);
  
  }


}
