import { SkillServiceResponse } from "../../../types/interfaceTypes";
import { SkillItem } from "../../../types/userTypes";

export default interface ISkillService{
    addSkill(skillNames:string[]):SkillServiceResponse
    getSkils():SkillServiceResponse
    removeSkill(skillId:string):{response:SkillItem, message:string}
}