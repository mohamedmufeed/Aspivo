import { Request, Response } from "express";

export interface IProfileController {
  editProfile(req: Request, res: Response): Promise<void>;
  getProfile(req: Request, res: Response): Promise<void>;
  editAbout(req: Request, res: Response): Promise<void>;
  addExperience(req: Request, res: Response): Promise<void>;
  editExperience(req: Request, res: Response): Promise<void>;
  addEducation(req: Request, res: Response): Promise<void>;
  editEducation(req: Request, res: Response): Promise<void>;
  addSkill(req: Request, res: Response): Promise<void>;
  uploadResume(req: Request, res: Response): Promise<void>;
  deleteResume(req: Request, res: Response): Promise<void>;
  subscriptionHistory(req: Request, res: Response): Promise<void>;
}
