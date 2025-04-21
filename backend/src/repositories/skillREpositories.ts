import Skill, { SkillDocument } from "../models/skills";
import { BaseRepository } from "./baseRepository";
export class SkillRepository extends BaseRepository<SkillDocument>{
    constructor(){
        super(Skill)
    }
    async createSkills(skillNames: string[]){
        const skills = skillNames.map((name) => ({ name }));
        return await Skill.insertMany(skills, { ordered: false });
    }
    async getSkills(){
        return await this.findAll()
    }
    async findByName(name:string){
        return await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    }
    async create(skillData:{ name: string }) {
        return await Skill.create(skillData);
    }
    async removeSkill(skillId:string){
        return await this.findByIdAndDelete(skillId)
    }
}