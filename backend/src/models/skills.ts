
import mongoose, { Schema } from "mongoose";
export interface ISkill  {
    name: string;
    createdAt: Date;
  }
const skillSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export type  SkillDocument= ISkill& Document
const Skill = mongoose.model<SkillDocument>("Skill", skillSchema);
export default Skill;