import mongoose, { Schema } from "mongoose";

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
