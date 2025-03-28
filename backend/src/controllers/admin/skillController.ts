import { Request, Response } from "express";
import { SkillService } from "../../services/adminService/skillService.js";
import HttpStatus from "../../utils/httpStatusCode.js";

const skillService = new SkillService();
export const addSkill = async (req: Request, res: Response) => {
  try {
    const { skills } = req.body;
    const response = await skillService.addSkill(skills);
    res.status(HttpStatus.OK).json(response);
  } catch (error) {
    console.log("the error adding the skil",error)
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server Error" });
  }
};

export const getSkills = async (req: Request, res: Response) => {
  try {
    const response = await skillService.getSkils();
    res.status(HttpStatus.OK).json(response);
  } catch (error) {

    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "internal server Error" });
  }
};
