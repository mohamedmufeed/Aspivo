import { INVALID_SKILL_DATA, SKILL_ADDED_SUCCESSFULLY, SKILL_REMOVED_SUCCESSFULLY, SKILLS_NOT_FOUND } from "../../constants/message";
import { ISkillRepository } from "../../interface/repositories/skillRepositories";
import ISkillService from "../../interface/service/admin/skillInterface";
import { ISkill } from "../../models/skills";
import { SkillRepository } from "../../repositories/skillREpositories";
import { GetPaginationQuery, GetSkillResponse } from "../../types/userTypes";
import HttpStatus from "../../utils/httpStatusCode";

export class SkillService implements ISkillService {
  constructor(private _skillRepository: ISkillRepository) {}

  async addSkill(skillNames: string[]):Promise<{addeddSkill:ISkill[], message:string}> {
    if (!Array.isArray(skillNames) || skillNames.length === 0) {
      throw new Error(INVALID_SKILL_DATA);
    }
    const addeddSkill = await this._skillRepository.createSkills(skillNames);
    return { addeddSkill, message: SKILL_ADDED_SUCCESSFULLY };
  }

  async getSkils(query:GetPaginationQuery):Promise<GetSkillResponse> {
    const response = await this._skillRepository.getSkills(query);
    if (!response) {
      throw { status: HttpStatus.BAD_REQUEST, message: SKILLS_NOT_FOUND };
    }
    return  response ;
  }

  async removeSkill(skillId: string):Promise<{response:ISkill, message:string}> {
    const response = await this._skillRepository.removeSkill(skillId);
    if(!response){
      throw {status:HttpStatus.BAD_REQUEST, message:SKILLS_NOT_FOUND}
    }
    return{response, message:SKILL_REMOVED_SUCCESSFULLY}
  }
}
