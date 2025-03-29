import Skill from "../models/skills.js";
export class SkillRepository{
    async createSkills(skillNames: string[]){
        const skills = skillNames.map((name) => ({ name }));
        return await Skill.insertMany(skills, { ordered: false });
    }
    async getSkills(){
        return await Skill.find()
    }
    async findByName(name:string){
        return await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    }
    async create(skillData:{ name: string }) {
        return await Skill.create(skillData);
    }
    async removeSkill(skillId:string){
        return await Skill.findByIdAndDelete(skillId)
    }
}