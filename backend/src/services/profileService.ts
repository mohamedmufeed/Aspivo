import { AuthRepostry } from "../repositories/userRepositories.js";
import { ProfileTypes } from "../types/userTypes";

const authRepostry = new AuthRepostry();

export class ProfileSerive {
  async editProfile(id: string, data: ProfileTypes) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");

    let profileImage = user.profileImage;
    if (data.profileImage) {
      profileImage = data.profileImage;
    }
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.position = data.currentPostion || user.position;
    user.location = data.location || user.location;

    await user.save();
    return { user, message: " Profile Updated sucsess fully" };
  }

  async getProfile(id: string) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");
    return { user, message: "User Found sucsess fully" };
  }

  async editAbout(id: string, about: string) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");
    user.about = about || user.about;
     await user.save()

    return { user, message: "User about edit sucsess fully" };
  }
}
