import { Request, Response } from "express";
import HttpStatus from "../../utils/httpStatusCode";
import ISkillController from "../../interface/controller/admin/skillControllerInterface";
import { ERROR_MESSAGES } from "../../constants/error";
import ISkillService from "../../interface/service/admin/skillInterface";
import { GetPaginationQuery } from "../../types/userTypes";

export class SkillController implements ISkillController {
  constructor(private _skillService: ISkillService) { }

  addSkill = async (req: Request, res: Response) => {
    try {
      const { skills } = req.body;
      const response = await this._skillService.addSkill(skills);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err = error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message });
    }
  };

  getSkills = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, q = "" } = req.query
      const query:GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(q)
      }
      const response = await this._skillService.getSkils(query);
        res.status(HttpStatus.OK).json({
        sucsess: true,
        skills: response.skills,
        totalSkills: response.totalSkills,
        totalPages: response.totalPages,
        message: "Fetch company successful"
      });
    } catch (error) {
      const err = error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ERROR_MESSAGES.SERVER_ERROR || err.message });
    }
  };

  removeSkill = async (req: Request, res: Response) => {
    try {
      const skillId = req.params.id;
      const response = await this._skillService.removeSkill(skillId);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const err = error as Error
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || ERROR_MESSAGES.SERVER_ERROR });
    }
  };
}
