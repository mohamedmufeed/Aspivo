import { channel } from "diagnostics_channel";
import mongoose, { Schema } from "mongoose";

export interface ICaht {
  channel: string;
  senderId: string;
  message: string;
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

const ChatMessage= mongoose.model("ChatMessage", ChatMessageSchema)
export default ChatMessage