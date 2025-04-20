
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

const Skill = mongoose.model<ISkill>("Skill", skillSchema);
export default Skill;