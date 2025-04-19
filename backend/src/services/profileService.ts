import { AuthRepostry } from "../repositories/userRepositories";
import { ProfileTypes, Experience, Education } from "../types/userTypes";
import cloudinary from "../config/cloudinaryConfig";
import { SkillRepository } from "../repositories/skillREpositories";

export class ProfileService {
  constructor(
    private readonly authRepository: AuthRepostry,
    private readonly skillRepository: SkillRepository
  ) {}

  async editProfile(id: string, data: ProfileTypes) {
    const user = await this.authRepository.findById(id);
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
    return { user, message: "Profile updated successfully" };
  }

  async getProfile(id: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");
    return { user, message: "User found successfully" };
  }

  async editAbout(id: string, about: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.about = about || user.about;
    await user.save();
    return { user, message: "User about section updated successfully" };
  }

  async addExperience(id: string, data: Experience) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    user.experiences.push({
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    });

    await user.save();
    return { user, message: "Experience added successfully" };
  }

  async editExperience(id: string, data: Experience, experienceId: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    const experience = user.experiences.id(experienceId);
    if (!experience) throw new Error("Experience not found");

    Object.assign(experience, data);
    user.markModified("experiences");
    await user.save();
    return { user, message: "Experience edited successfully" };
  }

  async addEducation(id: string, data: Education) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    user.education.push(data);
    await user.save();
    return { user, message: "Education added successfully" };
  }

  async editEducation(id: string, data: Education, educationId: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    const education = user.education.id(educationId);
    if (!education) throw new Error("Education not found");

    Object.assign(education, data);
    user.markModified("education");
    await user.save();
    return { user, message: "Education edited successfully" };
  }

  async addSkill(id: string, skills: string[]) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    user.skills = user.skills || [];

    const newSkills = skills.filter(
      (skill) =>
        !user.skills.some(
          (existing) => existing.toLowerCase() === skill.toLowerCase()
        )
    );

    if (newSkills.length === 0) {
      throw { status: 400, message: "Skills already exist" };
    }

    user.skills.push(...newSkills);
    await user.save();

    for (const skill of newSkills) {
      try {
        const exists = await this.skillRepository.findByName(skill);
        if (!exists) {
          await this.skillRepository.create({ name: skill });
        }
      } catch (error) {
        console.error(`Error saving skill "${skill}" to suggestions:`, error);
      }
    }

    return { user, message: "Skills added successfully" };
  }

  async uploadResume(id: string, url: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (url) {
      user.resume = url;
      await user.save();
    }

    return { user, message: "Resume uploaded successfully" };
  }

  async deleteResume(id: string) {
    const user = await this.authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (user.resume) {
      const publicId = user.resume.split("/").pop()?.split(".")[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting resume from Cloudinary:", err);
          throw new Error("Failed to delete resume from Cloudinary");
        }
      }
      user.resume = "";
      await user.save();
    }

    return { user, message: "Resume deleted successfully" };
  }

  async subscriptionHistory(userId: string) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const subscriptions = await this.authRepository.findSubscriptions(userId);
    return { subscriptions, message: "Subscriptions found" };
  }
}
