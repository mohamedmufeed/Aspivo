import { ISkill } from "../../../models/skills";
import { SkillServiceResponse } from "../../../types/interfaceTypes";
import { SkillItem } from "../../../types/userTypes";

export default interface ISkillService{
    addSkill(skillNames:string[]):Promise<{addeddSkill:ISkill[], message:string}>
    getSkils():Promise<{response:ISkill[], message:string}>
    removeSkill(skillId:string):Promise<{response:ISkill, message:string}>
}