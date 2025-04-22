import { SkillDocument } from "../../models/skills";

export interface ISkillRepository {
    createSkills(skillNames: string[]): Promise<SkillDocument[]>;
    getSkills(): Promise<SkillDocument[]>;
    findByName(name: string): Promise<SkillDocument | null>;
    create(skillData: { name: string }): Promise<SkillDocument>;
    removeSkill(skillId: string): Promise<SkillDocument | null>;
  }
  