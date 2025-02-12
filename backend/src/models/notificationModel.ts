import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId; // Recipient user
  type: "comment" | "upvote" | "downvote" | "admin"; // Notification type
  crimeReport?: mongoose.Types.ObjectId; // Reference to crime report (if applicable)
  comment?: mongoose.Types.ObjectId; // Reference to comment (if applicable)
  message: string; // Notification message
  isRead: boolean; // Read status
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["comment", "upvote", "downvote", "admin"],
      required: true,
    },
    crimeReport: { type: mongoose.Types.ObjectId, ref: "CrimeReport" },
    comment: { type: mongoose.Types.ObjectId, ref: "Comment" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
