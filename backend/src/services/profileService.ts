import { AuthRepostry } from "../repositories/userRepositories";
import { ProfileTypes } from "../types/userTypes";
import cloudinary from "../config/cloudinaryConfig";
import { SkillRepository } from "../repositories/skillREpositories";
import { Experience, Education, IUser, } from "../models/user";
import { ai } from "../config/openai";

import IProfileService from "../interface/service/user/profileServiceInterface";

import { SubscriptionHistoryResponse } from "../types/interfaceTypes";
import { generateResumePrompt } from "../utils/resumePrompt";


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
        const error = err as Error
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
          throw new Error("Failed to delete resume from Cloudinary", error);
        }
      }
      user.resume = "";
      await user.save();
    }

    return { user, message: "Resume deleted successfully" };
  }

  async subscriptionHistory(userId: string): Promise<SubscriptionHistoryResponse> {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new Error("User not found");
    const subscription = await this._authRepository.findSubscriptions(userId);
    return { subscription, message: "Subscriptions found" };
  }
  async generateResumeFromProfile(userId: string) {
    const user = await this._authRepository.findById(userId)
    if (!user) throw new Error("User not found")
    const propmt = generateResumePrompt(user)
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: propmt,
    })
    const response = aiResponse.text
    return { response, message: "resume generate successfully" }
  }
  async textFormating(text: string, propmtKey: string, userId: string) {
    const user = await this._authRepository.findById(userId)
    if (!user) throw new Error("User not found")
    if (!user.features.unlockAiFeatures) throw new Error("User subscription is not done")
    const promptTemplates: { [key: string]: string } = {
      'makeAbout': `
    The user has written a lengthy 'About' section for their resume. Refine and condense it into a concise, professional summary (100-150 words) while preserving the core professional details such as years of experience, industry/field, key skills, and significant achievements. Remove redundant phrases, unnecessary personal anecdotes, and non-professional content. Ensure the output is polished and suitable for a resume, no options need give only one:

    Input: ${text}
  `,
      'makeChat': `
    Convert the following casual chat message into a concise, professional version. Preserve the core meaning of the message, but adjust the tone and language to be formal and suitable for a professional context. Do not include any additional suggestions, options, or unrelated content—just the refined message:

    Input: ${text}
  `
    };
    const propmt = promptTemplates[propmtKey]
    if (!propmt) throw new Error("Invalid prompt key provided");
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: propmt,
    })
    const response = aiResponse.text
    return { response, message: "Text formatted successfully" }
  }
}
