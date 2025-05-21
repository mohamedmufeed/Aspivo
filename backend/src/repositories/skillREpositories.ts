import { ISkillRepository } from "../interface/repositories/skillRepositories";
import Skill, { SkillDocument } from "../models/skills";
import { GetPaginationQuery } from "../types/userTypes";
import { BaseRepository } from "./baseRepository";
export class SkillRepository extends BaseRepository<SkillDocument> implements ISkillRepository {
    constructor() {
        super(Skill)
    }
    async createSkills(skillNames: string[]) {
        const skills = skillNames.map((name) => ({ name }));
        return await Skill.insertMany(skills, { ordered: false });
    }
    async getSkills({ page, limit, searchQuery }: GetPaginationQuery) {
        const skip = (page - 1) * limit
        const searchFilter = searchQuery
            ? {
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                ]
            }
            : {}
        const skills = await Skill.find(searchFilter).skip(skip).limit(limit).sort({ createdAt: -1 })
        const totalSkills = await Skill.countDocuments(searchFilter);
        const totalPages = Math.ceil(totalSkills / limit);
        return {skills,totalSkills,totalPages}
    }
    async findByName(name: string) {
        return await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    }
    async create(skillData: { name: string }) {
        return await Skill.create(skillData);
    }
    async removeSkill(skillId: string) {
        return await this.findByIdAndDelete(skillId)
    }
}