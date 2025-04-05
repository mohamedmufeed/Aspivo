import mongoose, { Mongoose, Schema } from "mongoose";

const TeamSchema = new Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
});

const Team = mongoose.model("Team", TeamSchema);
export default Team
