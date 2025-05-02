import { Request, Response } from "express";
import { ProfileService } from "../../services/profileService";
import HttpStatus from "../../utils/httpStatusCode";
import { IProfileController } from "../../interface/controller/user/profileControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import logger from "../../logger";

export class ProfileController implements IProfileController {

  constructor(private _profileService: ProfileService) { }

  public editProfile = async (req: Request, res: Response): Promise<void> => {
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

      const updatedProfile = await this._profileService.editProfile(userId, data);
      res.status(HttpStatus.OK).json({ message: "User profile updated successfully", updatedProfile });
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : `Failed to update user profile${err.message}` ,
      });
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const user = await this._profileService.getProfile(userId);
      res.status(HttpStatus.OK).json({ user, message: "User found successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to fetch user profile",
      });
    }
  };

  public editAbout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { about } = req.body;
      const user = await this._profileService.editAbout(userId, about);
      res.status(HttpStatus.OK).json({ user, message: "User about updated successfully" });
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `"Failed to update about section ${err.message}`, });
    }
  };

  public addExperience = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const user = await this._profileService.addExperience(userId, data);
      res.status(HttpStatus.OK).json({ user, message: "Experience added successfully" });
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to add experience ${err.message}` });
    }
  };

  public editExperience = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { ...data } = req.body;
      const response = await this._profileService.editExperience(userId, data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err = error as Error;
      logger.info("the errorr is ", error)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  };

  public addEducation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const response = await this._profileService.addEducation(userId, data);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to add education ${error}`});
    }
  };

  public editEducation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { ...data } = req.body;
      const response = await this._profileService.editEducation(userId, data);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to edit education: ${error}` });
    }
  };

  public addSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { skills } = req.body;
      const response = await this._profileService.addSkill(userId, skills);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to add skills${err.message}` });
    }
  };

  public uploadResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const resumeUrl = Object.keys(req.body)[0];
      if (!resumeUrl || !resumeUrl.startsWith("http")) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid resume URL" });
        return
      }
      const response = await this._profileService.uploadResume(userId, resumeUrl);
      res.json({ response });
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to upload resume ${err.message}` });
    }
  };

  public deleteResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._profileService.deleteResume(userId);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message:` Failed to delete resume ${err.message}` });
    }
  };

  public subscriptionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._profileService.subscriptionHistory(userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: `Failed to fetch subscription history ${err.message}`});
    }
  };

  public generateResumeFromProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id
      const response = await this._profileService.generateResumeFromProfile(userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const err= error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message})
    }
  }
  public textFormating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id
      const { text, propmtKey } = req.body
      const response = await this._profileService.textFormating(text, propmtKey, userId)
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const err = error as Error
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message})
    }
  }
}

