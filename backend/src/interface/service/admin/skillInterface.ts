import { ISkill } from "../../../models/skills";
import { GetPaginationQuery, GetSkillResponse } from "../../../types/userTypes";


export default interface ISkillService{
    addSkill(skillNames:string[]):Promise<{addeddSkill:ISkill[], message:string}>
    getSkils(query:GetPaginationQuery):Promise<GetSkillResponse>
    removeSkill(skillId:string):Promise<{response:ISkill, message:string}>
}