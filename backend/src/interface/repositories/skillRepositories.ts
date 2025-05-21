import { SkillDocument } from "../../models/skills";
import { GetPaginationQuery, GetSkillResponse } from "../../types/userTypes";

export interface ISkillRepository {
    createSkills(skillNames: string[]): Promise<SkillDocument[]>;
    getSkills({ page, limit, searchQuery }: GetPaginationQuery): Promise<GetSkillResponse>;
    findByName(name: string): Promise<SkillDocument | null>;
    create(skillData: { name: string }): Promise<SkillDocument>;
    removeSkill(skillId: string): Promise<SkillDocument | null>;
  }
  