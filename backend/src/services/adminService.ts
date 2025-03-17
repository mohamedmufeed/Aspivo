import { AdminRepostry } from "../repositories/adminRepositories.js";
import { NotificationService } from "./notificationService.js";
import { sendNotification } from "../server.js";
const notificationService = new NotificationService();
export class AdminService {
  private adminRepostry = new AdminRepostry();
  async blockUser(id: string) {
    const user = await this.adminRepostry.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    await user.save();
    return { user, message: "User status chnages sucsessfully" };
  }

  async handleCompanyRequest(comapnyId: string, action: string) {
    const company = await this.adminRepostry.findComapny(comapnyId);
    if (!company) throw new Error("Company not found");
    if (action === "Approved") {
      company.status = action || "Approved";
    } else if (action === "Rejected") {
      company.status = action || "Rejected";
    } else {
      company.status = "Pending";
    }
    await company.save();
    const message = `Your company '${company.companyName}' has been approved!`;
    await notificationService.createNotification(
      company.userId.toString(),
      message
    );
    sendNotification("user", company.userId.toString(), message);
    return { company };
  }
}
