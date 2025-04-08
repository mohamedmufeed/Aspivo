
import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    channel: { type: String, required: true, unique: true },
    participants: [
        {
            userId: { type: String, required: true },
            role: { type: String, enum: ["company", "employee"], required: true },
        },
    ],
    lastMessage: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
    unread: { type: Boolean, default: false },
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;