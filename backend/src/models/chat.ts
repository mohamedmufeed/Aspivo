
import mongoose, { Schema } from "mongoose";

export interface IChatMessage extends Document {
    channel: string;
    senderId: string;
    message: string;
    timestamp: Date;
  }

const ChatMessageSchema= new Schema({
    channel:{
        type:String,
        required:true,
        index:true
    },
    senderId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
})

const ChatMessage= mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema)
export default ChatMessage