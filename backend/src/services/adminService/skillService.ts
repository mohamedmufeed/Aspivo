import { SkillRepository } from "../../repositories/skillREpositories.js";
import HttpStatus from "../../utils/httpStatusCode.js";

export class SkillService {
  private skillRespositories = new SkillRepository();

  async addSkill(skillNames: string[]) {
    if (!Array.isArray(skillNames) || skillNames.length === 0) {
      throw new Error("Invalid skills data");
    }
    const addeddSkill = await this.skillRespositories.createSkills(skillNames);
    return { addeddSkill, message: "Skill addedd sucsessfully" };
  }

  async getSkils() {
    const response = await this.skillRespositories.getSkills();
    if (!response) {
      throw { status: HttpStatus.BAD_REQUEST, message: "Skils not found" };
    }
    return { response, message: "Skills found sucessfuly" };
  }

  async removeSkill(skillId: string) {
    const response = await this.skillRespositories.removeSkill(skillId);
    if(!response){
      throw {status:HttpStatus.BAD_REQUEST, message:"Skill not found"}
    }
    return{response, message:"Skill removed sucessfull"}
  }
}
