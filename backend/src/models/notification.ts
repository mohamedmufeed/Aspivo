import mongoose, { Schema, Document } from "mongoose";

 export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; 
  message: string;
  isRead:boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  message: { type: String, required: true },
  isRead:{type:Boolean,default:false},
  createdAt: { type: Date, default: Date.now },
});
export type NotificationDocument= INotification& Document
const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;

