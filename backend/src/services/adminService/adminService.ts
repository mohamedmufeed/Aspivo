import { AdminRepostry } from "../../repositories/adminRepositories";
import { NotificationService } from "../notificationService";
import { sendNotification } from "../../server";
import IAdminService from "../../interface/service/admin/adminInterface.js";
const notificationService = new NotificationService();

export class AdminService   {
  constructor(private adminRepository: AdminRepostry) {}

  async getAllCompanies() {
    return await this.adminRepository.findAllCompany();
  }

  async blockUser(id: string) {
    const user = await this.adminRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    await user.save();
    return { user, message: "User status changed successfully" };
  }

  async handleCompanyRequest(companyId: string, action: string) {
    const company = await this.adminRepository.findComapny(companyId);
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
    await notificationService.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    return { company, message: "Company status changed successfully" };
  }

  async approvedCompany() {
    const company = await this.adminRepository.findApprovedCompany();
    if (!company) {
      throw new Error("Company not found");
    }
    return { company, message: "Approved company found successfully" };
  }
}
