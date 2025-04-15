import { Request, Response } from "express";

export default interface ICompanyProfileController {
  getProfile(req: Request, res: Response): Promise<void>;
  editCompanyProfile(req: Request, res: Response): Promise<void>;
  editCompanyDescription(req: Request, res: Response): Promise<void>;
  addTechStack(req: Request, res: Response): Promise<void>;
  editTeam(req: Request, res: Response): Promise<void>;
  editContact(req: Request, res: Response): Promise<void>;
}
