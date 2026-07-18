import { Document, model, Schema, Types } from "mongoose";

export interface NotificationDocument extends Document {
    title: string;
    subject: string;
    sender: Types.ObjectId;
    reciever: Types.ObjectId;
    notificationType: Types.ObjectId;
    link: string;
    isSeen: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>({
    title: { type: String, required: [true, "Notification title is required"], trim: true },
    subject: { type: String, required: [true, "Notification subject is required"], trim: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Notification sender is required"] },
    reciever: { type: Schema.Types.ObjectId, ref: "User", required: [true, "Notification reciever is required"], index: true },
    notificationType: { type: Schema.Types.ObjectId, ref: "NotificationType", required: [true, "Notification type is required"] },
    link: { type: String, required: [true, "Notification link is required"], trim: true },
    isSeen: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ reciever: 1, createdAt: -1 });

export const NotificationModel = model<NotificationDocument>("Notification", notificationSchema);
