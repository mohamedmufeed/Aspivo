import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import ISkillController from "../../interface/controller/admin/skillControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import ISkillService from "../../interface/service/admin/skillInterface";

export class SkillController implements ISkillController {
  constructor(private _skillService: ISkillService) {}

  addSkill = async (req: Request, res: Response) => {
    try {
      const { skills } = req.body;
      const response = await this._skillService.addSkill(skills);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR|| err.message });
    }
  };

  getSkills = async (req: Request, res: Response) => {
    try {
      const response = await this._skillService.getSkils();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err= error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message:  ERROR_MESSAGES.SERVER_ERROR || err.message });
    }
  };

  removeSkill = async (req: Request, res: Response) => {
    try {
      const skillId = req.params.id;
      const response = await this._skillService.removeSkill(skillId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
   const err=error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message:  err.message|| ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
