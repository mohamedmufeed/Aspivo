import ISkillService from "../../interface/service/admin/skillInterface";
import { ISkill } from "../../models/skills";
import { SkillRepository } from "../../repositories/skillREpositories";
import HttpStatus from "../../utils/httpStatusCode";

export class SkillService implements ISkillService {
  constructor(private _skillRepository: SkillRepository) {}

  async addSkill(skillNames: string[]):Promise<{addeddSkill:ISkill[], message:string}> {
    if (!Array.isArray(skillNames) || skillNames.length === 0) {
      throw new Error("Invalid skills data");
    }
    const addeddSkill = await this._skillRepository.createSkills(skillNames);
    return { addeddSkill, message: "Skill addedd sucsessfully" };
  }

  async getSkils():Promise<{response:ISkill[], message:string}> {
    const response = await this._skillRepository.getSkills();
    if (!response) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Skils not found" };
    }
    return { response, message: "Skills found sucessfuly" };
  }

  async removeSkill(skillId: string):Promise<{response:ISkill, message:string}> {
    const response = await this._skillRepository.removeSkill(skillId);
    if(!response){
      throw {status:HttpStatus.BAD_REQUEST, message:"Skill not found"}
    }
    return{response, message:"Skill removed sucessfull"}
  }
}
