import { AuthRepostry } from "../repositories/userRepositories";
import { ProfileTypes } from "../types/userTypes";
import cloudinary from "../config/cloudinaryConfig";
import { SkillRepository } from "../repositories/skillREpositories";
import { Experience, Education } from "../models/user";
import { ai } from "../config/openai";

import IProfileService from "../interface/service/user/profileServiceInterface";

import { SubscriptionHistoryResponse } from "../types/interfaceTypes";
import { generateResumePrompt } from "../utils/resumePrompt";
import { http } from "winston";
import HttpStatus from "../utils/httpStatusCode";
import { IAuthRepository } from "../interface/repositories/userRepositories";
import { ISkillRepository } from "../interface/repositories/skillRepositories";
import { userProfileDto } from "../utils/dto/userDto";
import { EDUCATION_ADDED_SUCCESSFULLY, EDUCATION_EDITED_SUCCESSFULLY, EDUCATION_NOT_FOUND, EXPERIENCE_ADDED_SUCCESSFULLY, EXPERIENCE_EDITED_SUCCESSFULLY, EXPERIENCE_NOT_FOUND, INVALID_PROMPT_KEY_PROVIDED, NEW_SKILL_NAME_ALREADY_EXISTS, PROFILE_UPDATED_SUCCESSFULLY, RESUME_DELETED_SUCCESSFULLY, RESUME_GENERATED_SUCCESSFULLY, RESUME_UPLOADED_SUCCESSFULLY, SKILL_ADDED_SUCCESSFULLY, SKILL_UPDATED_SUCCESSFULLY, SKILLS_ALREADY_EXIST, SKILLS_NOT_FOUND, SUBSCRIPTION_NOT_FOUND, USER_ABOUT_SECTION_UPDATED_SUCCESSFULLY, USER_FOUND_SUCCESSFULLY, USER_NOT_FOUND, USER_SUBSCRIPTION_NOT_DONE } from "../constants/message";


export class ProfileService implements IProfileService {
  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _skillRepository: ISkillRepository
  ) { }

  async editProfile(id: string, data: ProfileTypes) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    if (data.profileImage) {
      user.profileImage = data.profileImage;
    }
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;
    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.position = data.position || user.position;
    user.location = data.location || user.location;
    await (user).save();
    const userDto = userProfileDto(user)
    return { user: userDto, message: PROFILE_UPDATED_SUCCESSFULLY };
  }

  async getProfile(id: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    const userDto = userProfileDto(user)
    return { user: userDto, message: USER_FOUND_SUCCESSFULLY };
  }

  async editAbout(id: string, about: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    user.about = about || user.about;
    await user.save();
    const userDto = userProfileDto(user)
    return { user: userDto, message: USER_ABOUT_SECTION_UPDATED_SUCCESSFULLY };
  }

  async addExperience(id: string, data: Experience) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    user.experiences.push({
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
    });

    await user.save();
    const userDto = userProfileDto(user)
    return { user: userDto, message: EXPERIENCE_ADDED_SUCCESSFULLY };
  }

  async editExperience(id: string, data: Experience) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);
    const experienceId = data._id;
    const experienceIndex = user.experiences.findIndex(
      (exp) => exp._id.toString() === experienceId.toString()
    );
    if (experienceIndex === -1) throw new Error(EXPERIENCE_NOT_FOUND);
    user.experiences[experienceIndex] = {
      ...user.experiences[experienceIndex],
      ...data
    };
    user.markModified("experiences");
    const updatedUser = await user.save();
    const userDto = userProfileDto(updatedUser)
    return { user: userDto, message: EXPERIENCE_EDITED_SUCCESSFULLY };
  }

  async addEducation(id: string, data: Education) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    user.education.push(data);
    await user.save();
    const userDto = userProfileDto(user)
    return { user: userDto, message:  EDUCATION_ADDED_SUCCESSFULLY };
  }

  async editEducation(id: string, data: Education,) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error();
    const educationId = data._id
    const educationIndex = user.education.findIndex((edu) => edu._id.toString() === educationId.toString())

    if (educationIndex === -1) throw new Error(EDUCATION_NOT_FOUND);
    user.education[educationIndex] = {
      ...user.education[educationIndex],
      ...data
    };
    (user).markModified("education");
    const updatedUser = await user.save();
    const userDto = userProfileDto(updatedUser)
    return { user: userDto, message: EDUCATION_EDITED_SUCCESSFULLY };
  }

  async addSkill(id: string, skills: string[]) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    user.skills = user.skills || [];

    const newSkills = skills.filter(
      (skill) =>
        !user.skills.some(
          (existing) => existing.toLowerCase() === skill.toLowerCase()
        )
    );

    if (newSkills.length === 0) {
      throw { status: 400, message: SKILLS_ALREADY_EXIST };
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
      const userDto=userProfileDto(user)
    return { user:userDto, message: SKILL_ADDED_SUCCESSFULLY };
  }

  async editSkill(userId: string, oldSkillName: string, newSkillName: string) {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new Error(USER_NOT_FOUND);
    user.skills = user.skills || [];
    const skillIndex = user.skills.findIndex(
      (skill) => skill.toLowerCase() === oldSkillName.toLowerCase()
    );

    if (skillIndex === -1) {
      throw { status: HttpStatus.NOT_FOUND, message: SKILLS_NOT_FOUND};
    }
    const newSkillExists = user.skills.some(
      (skill) => skill.toLowerCase() === newSkillName.toLowerCase()
    );

    if (newSkillExists) {
      throw { status: HttpStatus.BAD_REQUEST, message:  NEW_SKILL_NAME_ALREADY_EXISTS };
    }
    user.skills[skillIndex] = newSkillName;
    await user.save();
    try {
      const exists = await this._skillRepository.findByName(newSkillName);
      if (!exists) {
        await this._skillRepository.create({ name: newSkillName });
      }
    } catch (err) {
      const error = err as Error;
      throw new Error(`Error saving skill "${newSkillName}" to suggestions: ${error.message}`);
    }
      const userDto=userProfileDto(user)
    return { user:userDto, message: SKILL_UPDATED_SUCCESSFULLY };
  }

  async uploadResume(id: string, url: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    if (url) {
      user.resume = url;
      await user.save();
    }
      const userDto=userProfileDto(user)
    return { user:userDto, message:  RESUME_UPLOADED_SUCCESSFULLY };
  }

  async deleteResume(id: string) {
    const user = await this._authRepository.findById(id);
    if (!user) throw new Error(USER_NOT_FOUND);

    if (user.resume) {
      const publicId = user.resume.split("/").pop()?.split(".")[0];
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          const error = err as Error
          throw new Error(
           "CLUDI" , error);
        }
      }
      user.resume = "";
      
      await user.save();
    }
      const userDto=userProfileDto(user)
    return { user:userDto, message: RESUME_DELETED_SUCCESSFULLY };
  }

  async subscriptionHistory(userId: string): Promise<SubscriptionHistoryResponse> {
    const user = await this._authRepository.findById(userId);
    if (!user) throw new Error();
    const subscription = await this._authRepository.findSubscriptions(userId);
    return { subscription, message: SUBSCRIPTION_NOT_FOUND};
  }
  async generateResumeFromProfile(userId: string) {
    const user = await this._authRepository.findById(userId)
    if (!user) throw new Error(USER_NOT_FOUND)
    const propmt = generateResumePrompt(user)
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: propmt,
    })
    const response = aiResponse.text
    return { response, message: RESUME_GENERATED_SUCCESSFULLY }
  }
  async textFormating(text: string, propmtKey: string, userId: string) {
    const user = await this._authRepository.findById(userId)
    if (!user) throw new Error("User not found")
    if (!user.features.unlockAiFeatures) throw new Error(USER_SUBSCRIPTION_NOT_DONE)
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
    if (!propmt) throw new Error(INVALID_PROMPT_KEY_PROVIDED);
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: propmt,
    })
    const response = aiResponse.text
    return { response, message: 
      "TEXT FORMAT"
     }
  }
}
