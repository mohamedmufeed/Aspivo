import { use } from "passport";
import { AuthRepostry } from "../repositories/userRepositories.js";
import { ProfileTypes } from "../types/userTypes";
import { Experience } from "../types/userTypes";
import { Education } from "../types/userTypes";
import cloudinary from "../config/cloudinaryConfig.js";
import { SkillRepository } from "../repositories/skillREpositories.js";

const authRepository = new AuthRepostry();
const skillRepository = new SkillRepository();

export class ProfileSerive {
  async editProfile(id: string, data: ProfileTypes) {
    const user = await authRepository.findById(id);
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
    const user = await authRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
      return;
    }
    return { user, message: "User Found sucsess fully" };
  }

  async editAbout(id: string, about: string) {
    const user = await authRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.about = about || user.about;
    await user.save();

    return { user, message: "User about edit sucsess fully" };
  }

  async addExperience(id: string, data: Experience) {
    const user = await authRepository.findById(id);
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
    const user = await authRepository.findById(id);
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
    return { user, message: " Experice edited sucssefully" };
  }

  async addEducation(id: string, data: Education) {
    const user = await authRepository.findById(id);
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

  async editEducation(id: string, data: Education, educationId: string) {
    const user = await authRepository.findById(id);
    if (!user) throw new Error("User not found");
    const { degree, endDate, fieldOfStudy, grade, school, startDate } = data;
    const education = user.education.id(educationId);
    if (!education) throw new Error("Education not found");

    if (degree) education.degree = degree;
    if (fieldOfStudy) education.fieldOfStudy = fieldOfStudy;
    if (grade) education.grade = grade;
    if (school) education.school = school;
    if (endDate) education.endDate = endDate;
    if (startDate) education.startDate = startDate;
    user.markModified("education");
    await user.save();
    return { user, message: "User education edited sucsess fully" };
  }

  async addSkill(id: string, skills: string[]) {
    const user = await authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (!user.skills) {
      user.skills = [];
    }

    user.skills = Array.isArray(user.skills) ? user.skills : [];

    const newSkills = skills.filter(
      (skill) =>
        !user.skills.some(
          (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase()
        )
    );

    if (newSkills.length === 0) {
      throw { status: 400, message: " skills already exist" };
    }

    user.skills.push(...newSkills);

    await user.save();

    for (const skill of newSkills) {
      try {
        const existingSkill = await skillRepository.findByName(skill);
        if (!existingSkill) {
          await skillRepository.create({ name: skill });
        }
      } catch (error) {
        console.error(`Error adding skill "${skill}" to suggestions:`, error);
      }
    }

    return { user, message: "User skill added successfully" };
  }

  async uploadResume(id: string, url: string) {
    const user = await authRepository.findById(id);
    if (!user) throw new Error("User not found");
    if (url) {
      user.resume = url;
      await user.save();
    }
    return { user, message: "Resume Uplaoded sucess fully" };
  }

  async deleteResume(id: string) {
    const user = await authRepository.findById(id);
    if (!user) throw new Error("User not found");
    if (user.resume) {
      const publicId = user.resume.split("/").pop()?.split(".")[0];

      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Error deleting resume from Cloudinary:", error);
          throw new Error("Failed to delete resume from Cloudinary");
        }
      }
      user.resume = "";
      await user.save();
    }

    return { user, message: "User resume deleted sucsess fully" };
  }

  async subscriptionHistory(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const subscriptions = await authRepository.findSubscriptions(userId);
    return { subscriptions, message: "Subscription found" };
  }
}
