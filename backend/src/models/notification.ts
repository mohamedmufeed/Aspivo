import mongoose, { Schema, Document } from "mongoose";

interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // Ensure it's an ObjectId
  message: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Fix here
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;

