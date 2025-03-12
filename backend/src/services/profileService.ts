import { use } from "passport";
import { AuthRepostry } from "../repositories/userRepositories.js";
import { ProfileTypes } from "../types/userTypes";
import { Experience } from "../types/userTypes";
import { Education } from "../types/userTypes";

const authRepostry = new AuthRepostry();

export class ProfileSerive {
  
  async editProfile(id: string, data: ProfileTypes) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");

    if (data.profileImage) {
      user.profileImage = data.profileImage;  
    }
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.position = data.position || user.position;
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
    await user.save();

    return { user, message: "User about edit sucsess fully" };
  }

  async addExperience(id: string, data: Experience) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");

    const {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
      currentlyWorking,
    } = data;

    user.experiences.push({
      title,
      company,
      description,
      employmentType,
      endDate: endDate ? new Date(endDate) : null,
      startDate: new Date(startDate),
      location,
      currentlyWorking,
    });

    await user.save();
    return { user, message: "User experience added successfully" };
  }

  async editExperience(id: string, data: Experience, experienceId: string) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");
    const {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
    } = data;
    const experience = user.experiences.id(experienceId);
    if (!experience) throw new Error("Experince not found");

    if (title) experience.title = title;
    if (company) experience.company = company;
    if (description) experience.description = description;
    if (employmentType) experience.employmentType = employmentType;
    if (endDate) experience.endDate = endDate;
    if (location) experience.location = location;
    if (startDate) experience.startDate = startDate;

    user.markModified("experiences");
    await user.save();
    console.log("After saving: ", JSON.stringify(user, null, 2));

    return { user, message: " Experice edited sucssefully" };
  }

  async addEducation(id: string, data: Education) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");
    const { degree, endDate, fieldOfStudy, grade, school, startDate } = data;
    user.education.push({
      degree,
      endDate,
      fieldOfStudy,
      grade,
      school,
      startDate,
    });
    await user.save();
    return { user, message: "user education addedd sucses fully" };
  }

  async addSkill(id: string, skills: string[]) {
    const user = await authRepostry.findById(id);
    if (!user) throw new Error("User not found");
    
    if (!user.skills) {
        user.skills = [];
    }
  
    const newSkills = skills.filter(skill => !user.skills.includes(skill));

    if (newSkills.length === 0) {
        return {status: 400,message:" skills already exist"}
    }

    user.skills.push(...newSkills);

    await user.save();

    return { user, message: "User skill added successfully" };
}

}
