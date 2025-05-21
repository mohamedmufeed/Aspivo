import mongoose, { Schema } from "mongoose";

import { Document, Types } from "mongoose";

export interface IMeeting extends Document {
  roomId: string;
  peerId: string;
  startTime: string;
  initiatorId: Types.ObjectId;
  targetId: Types.ObjectId;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}


const meetingSchema = new Schema(
  {
    roomId: { type: String, required: true },
    peerId: { type: String, required: true },
    startTime: { type: String, required: true }, 
    initiatorId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    targetId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
