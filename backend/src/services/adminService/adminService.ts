import { AdminRepostry } from "../../repositories/adminRepositories";
import { NotificationService } from "../notificationService";
import { sendNotification } from "../../server";
import IAdminService from "../../interface/service/admin/adminInterface";
import { NotificationRepository } from "../../repositories/notificationRepository";
import { Company } from "../../types/companyTypes";
import { User } from "../../types/userTypes";
import { IUser } from "../../models/user";
import { ICompany } from "../../models/company";

export class AdminService  implements IAdminService  {
  constructor(private _adminRepository: AdminRepostry, private _notificationRespository:NotificationRepository) {}

  async getAllCompanies():Promise<ICompany[]> {
    return await this._adminRepository.findAllCompany();
  }

  async blockUser(id: string):Promise<{user:IUser, message:string}> {
    const user = await this._adminRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    await user.save();
    return { user, message: "User status changed successfully" };
  }

  async handleCompanyRequest(companyId: string, action: string):Promise<{company:ICompany, message:string}> {
    const company = await this._adminRepository.findComapny(companyId);
    if (!company) throw new Error("Company not found");
    if (action === "Approved") {
      company.status = action || "Approved";
    } else if (action === "Declined") {
      company.status = action || "Declined";
    } else {
      company.status = "Pending";
    }
    await company.save();
    const message = `Your company '${company.companyName}' has been ${action}!`;
    await this._notificationRespository.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    return { company, message: "Company status changed successfully" };
  }

  async approvedCompany():Promise<{company:ICompany[], message:string}> {
    const company = await this._adminRepository.findApprovedCompany();
    if (!company) {
      throw new Error("Company not found");
    }
    return { company, message: "Approved company found successfully" };
  }
}
