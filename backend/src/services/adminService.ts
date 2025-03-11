import { AdminRepostry } from "../repositories/adminRepositories.js";



export class AdminService {
  private adminRepostry = new AdminRepostry();
  async blockUser(id: string) {
    const user = await this.adminRepostry.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    await user.save()
    return { user, message: "User status chnages sucsessfully" };
  }
}
