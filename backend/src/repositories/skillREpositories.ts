import Skill from "../models/skills.js";
export class SkillRepository{
    async createSkills(skillNames:string[]){
        const skills=skillNames.map((name)=>name)
        return await Skill.insertMany(skills)
    }
    async getSkills(){
        return await Skill.find()
    }
}