import mongoose, { Schema } from "mongoose";

const JobApplicationSchema = new Schema({
  jobId: {
    type: mongoose.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});


const JobApplication= mongoose.model("JObApplication",JobApplicationSchema)
export default JobApplication