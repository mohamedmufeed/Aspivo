
import mongoose, { Schema } from "mongoose";

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

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;