import { Request, Response } from "express";
import { SkillService } from "../../services/adminService/skillService.js";
import HttpStatus from "../../utils/httpStatusCode.js";
import ISkillController from "../../interface/controller/admin/skillControllerInterface.js";

export class SkillController implements ISkillController {
  constructor(private skillService: SkillService) {}

  addSkill = async (req: Request, res: Response) => {
    try {
      const { skills } = req.body;
      const response = await this.skillService.addSkill(skills);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error adding the skill:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server Error" });
    }
  };

  getSkills = async (req: Request, res: Response) => {
    try {
      const response = await this.skillService.getSkils();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error getting skills:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server Error" });
    }
  };

  removeSkill = async (req: Request, res: Response) => {
    try {
      const skillId = req.params.id;
      const response = await this.skillService.removeSkill(skillId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.log("Error removing skill:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server Error" });
    }
  };
}
