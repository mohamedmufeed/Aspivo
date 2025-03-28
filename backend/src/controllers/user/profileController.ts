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
): Promise<void> => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNumber, position, location } = req.body;
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

    res
      .status(200)
      .json({ message: "User Profile updated scusessfully", updatedProfile });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await profileService.getProfile(userId);
    res.status(200).json({ user, message: "User Found sucsess full" });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "User profile updated  failed",
    });
  }
};

export const editAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { about } = req.body;
    const user = await profileService.editAbout(userId, about);
    res.status(200).json({ user, message: "User About edited successfully" });
  } catch (error) {
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "User About edited failed",
    });
  }
};

export const addExprience = async (
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
    res
      .status(200)
      .json({ user, message: "User Experience added sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Error  adding experince" });
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
    console.log(data);

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

export const editEducation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.id;
  try {
    const {
      degree,
      endDate,
      fieldOfStudy,
      grade,
      school,
      startDate,
      educationId,
    } = req.body;
    const data = { degree, endDate, fieldOfStudy, grade, school, startDate };
    const response = await profileService.editEducation(
      userId,
      data,
      educationId
    );
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: `error editing skill :${error}` });
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

export const uploadResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const resumeUrl = Object.keys(req.body)[0];
    if (!resumeUrl || !resumeUrl.startsWith("http")) {
      res.status(400).json({ message: "Invalid resume URL" });
    }
    const response = await profileService.uploadResume(userId, resumeUrl);

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: "Error uplaoding Resume" });
  }
};

export const deleteResume = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const response = await profileService.deleteResume(userId);
    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "Error deleting resume" });
  }
};
