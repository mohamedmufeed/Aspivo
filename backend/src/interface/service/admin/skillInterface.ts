import { ISkill } from "../../../models/skills";


export default interface ISkillService{
    addSkill(skillNames:string[]):Promise<{addeddSkill:ISkill[], message:string}>
    getSkils():Promise<{response:ISkill[], message:string}>
    removeSkill(skillId:string):Promise<{response:ISkill, message:string}>
}