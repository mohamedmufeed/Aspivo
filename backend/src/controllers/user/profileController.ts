import { Request, Response } from "express";
import { ProfileService } from "../../services/profileService";
import HttpStatus from "../../utils/httpStatusCode";
import { IProfileController } from "../../interface/controller/user/profileControllerInterface";

export class ProfileController implements IProfileController {
  // private profileService: ProfileSerive;

  // constructor() {
  //   this.profileService = new ProfileSerive();
  // }
    constructor(private _profileService:ProfileService) {}

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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to update user profile",
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to update about section" });
    }
  };

  public addExperience = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const user = await this._profileService.addExperience(userId, data);
      res.status(HttpStatus.OK).json({ user, message: "Experience added successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to add experience" });
    }
  };

  public editExperience = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { experienceId, ...data } = req.body;
      const user = await this._profileService.editExperience(userId, data, experienceId);
      res.status(HttpStatus.OK).json({ user, message: "Experience updated successfully" });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to update experience" });
    }
  };

  public addEducation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const data = req.body;
      const response = await this._profileService.addEducation(userId, data);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to add education" });
    }
  };

  public editEducation = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const { educationId, ...data } = req.body;
      const response = await this._profileService.editEducation(userId, data, educationId);
      res.status(HttpStatus.OK).json({ response });
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to add skills" });
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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to upload resume" });
    }
  };

  public deleteResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._profileService.deleteResume(userId);
      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete resume" });
    }
  };

  public subscriptionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const response = await this._profileService.subscriptionHistory(userId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch subscription history" });
    }
  };
}
