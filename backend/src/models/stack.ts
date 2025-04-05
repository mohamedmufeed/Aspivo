
import mongoose, { Schema } from "mongoose";

const StackSchema = new Schema({
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

const Stack = mongoose.model("Skill", StackSchema);
export default Stack;