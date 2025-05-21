import mongoose, { ObjectId, Schema } from "mongoose";

export interface ISubscription  {
  _id: ObjectId;
  userId: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  subscriptionId: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
const subscriptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false, 
    },
    subscriptionId: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export type SubscriptionDocument= ISubscription & Document
const Subscription = mongoose.model<SubscriptionDocument>("Subscription", subscriptionSchema);
export default Subscription;