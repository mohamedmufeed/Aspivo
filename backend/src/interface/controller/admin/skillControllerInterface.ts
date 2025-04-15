import { Request, Response } from "express";

export default interface ISkillController {
  addSkill(req: Request, res: Response): Promise<void>;
  getSkills(req: Request, res: Response): Promise<void>;
  removeSkill(req: Request, res: Response): Promise<void>;
}
