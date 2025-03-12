import { Request, Response } from "express";
import { AuthService } from "../../services/authService.js";
import { ProfileSerive } from "../../services/profileService.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { json } from "stream/consumers";
import { promises } from "dns";

const profileService = new ProfileSerive();

export const editProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNumber, position, location } =
      req.body;
    const path = req.file?.path;
    const data = {
      profileImage: path || "",
      firstName,
      lastName,
      phoneNumber,
      position,
      location,
    };

    const updatedProfile = await profileService.editProfile(userId, data);

    return res
      .status(200)
      .json({ message: "User Profile updated scusessfully", updatedProfile });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const user = await profileService.getProfile(userId);
    return res.status(200).json({ user, message: "User Found sucsess full" });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const editAbout = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const { about } = req.body;
    const user = await profileService.editAbout(userId, about);
    return res
      .status(200)
      .json({ user, message: "User About edited successfully" });
  } catch (error) {
    return res.status(500).json({
      error:
        error instanceof Error ? error.message : "User About edited failed",
    });
  }
};

export const uploadResume = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log(req.file);
    if (req.file) {
      console.log("file is done");
    }

    return res.status(200).json({ message: "Resueme is good" });
  } catch (error) {
    return res.status(500).json({ message: "Error in uplaoding resume" });
  }
};

export const addExprience = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.params.id;
    const {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
      currentlyWorking,
    } = req.body;
    const data = {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
      currentlyWorking,
    };
    const user = await profileService.addExperience(userId, data);
    return res
      .status(200)
      .json({ user, message: "User Experience added sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error  adding experince" });
  }
};

export const editExperince = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;

    const {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
      experienceId,
      currentlyWorking,
    } = req.body;

    const data = {
      title,
      company,
      description,
      employmentType,
      endDate,
      location,
      startDate,
      currentlyWorking,
    };
    console.log(data)

    const user = await profileService.editExperience(
      userId,
      data,
      experienceId
    );

    res
      .status(200)
      .json({ user, message: "User experince edited sucssessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error  editing experince" });
  }
};

export const addEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const { school, degree, fieldOfStudy, startDate, endDate, grade } =
      req.body;
    const data = { school, degree, fieldOfStudy, startDate, endDate, grade };
    const response = await profileService.addEducation(userId, data);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "error adding education" });
  }
};

export const addSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { skills } = req.body;

    const response = await profileService.addSkill(userId, skills);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "error adding skill" });
  }
};
