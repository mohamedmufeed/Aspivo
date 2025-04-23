import { AuthRepostry } from "../repositories/userRepositories";
import { ProfileTypes } from "../types/userTypes";
import cloudinary from "../config/cloudinaryConfig";
import { SkillRepository } from "../repositories/skillREpositories";
import { Experience, Education, } from "../models/user";
import mongoose from "mongoose";

import IProfileService from "../interface/service/user/profileServiceInterface";

import { SubscriptionHistoryResponse } from "../types/interfaceTypes";


export class ProfileService implements IProfileService {
  constructor(
    private readonly _authRepository: AuthRepostry,
    private readonly _skillRepository: SkillRepository
  ) { }

  async editProfile(id: string, data: ProfileTypes) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (data.profileImage) {
      user.profileImage = data.profileImage;
    }
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.position = data.position || user.position;
    user.location = data.location || user.location;
    await (user).save();
    return { user, message: "Profile updated successfully" };
  }

  async getProfile(id: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");
    return { user, message: "User found successfully" };
  }

  async editAbout(id: string, about: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");
    user.about = about || user.about;
    await user.save();
    return { user, message: "User about section updated successfully" };
  }

  async addExperience(id: string, data: Experience) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");

    user.experiences.push({
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    });

    await user.save();
    return { user, message: "Experience added successfully" };
  }

  async editExperience(id: string, data: Experience) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");
    const experienceId = data._id;
    const experienceIndex = user.experiences.findIndex(
      (exp) => exp._id.toString() === experienceId.toString()
    );
    if (experienceIndex === -1) throw new Error("Experience not found");
    user.experiences[experienceIndex] = {
      ...user.experiences[experienceIndex],
      ...data
    };
    user.markModified("experiences");
    const updatedUser = await user.save();
    return { user: updatedUser, message: "Experience edited successfully" };
  }

  async addEducation(id: string, data: Education) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");

    user.education.push(data);
    await user.save();
    return { user, message: "Education added successfully" };
  }

  async editEducation(id: string, data: Education,) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");
    const educationId = data._id
    const educationIndex = user.education.findIndex((edu) => edu._id.toString() === educationId.toString())

    if (educationIndex === -1) throw new Error("Experience not found");
    user.education[educationIndex] = {
      ...user.education[educationIndex],
      ...data
    };
    (user).markModified("education");
    const updatedUser = await user.save();
    return { user: updatedUser, message: "Education edited successfully" };
  }

  async addSkill(id: string, skills: string[]) {
    const user = await this._authRepository.findById(id);
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
        const exists = await this._skillRepository.findByName(skill);
        if (!exists) {
          await this._skillRepository.create({ name: skill });
        }
      } catch (err) {
        const error= err as Error
        throw new Error(`Error saving skill "${skill}" to suggestions:`, error)
   
      }
    }

    return { user, message: "Skills added successfully" };
  }

  async uploadResume(id: string, url: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (url) {
      user.resume = url;
      await user.save();
    }

    return { user, message: "Resume uploaded successfully" };
  }

  async deleteResume(id: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error("User not found");

    if (user.resume) {
      const publicId = user.resume.split("/").pop()?.split(".")[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          const error = err as Error
          throw new Error("Failed to delete resume from Cloudinary",error);
        }
      }
      user.resume = "";
      await user.save();
    }

    return { user, message: "Resume deleted successfully" };
  }

  async subscriptionHistory(userId: string):Promise<SubscriptionHistoryResponse> {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const subscription = await this._authRepository.findSubscriptions(userId);
    return { subscription, message: "Subscriptions found" };
  }
}
