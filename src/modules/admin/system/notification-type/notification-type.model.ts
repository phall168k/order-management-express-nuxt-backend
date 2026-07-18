import { Document, model, Schema, Types } from "mongoose";

export interface NotificationTypeDocument extends Document {
    name: string;
    icon: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notificationTypeSchema = new Schema<NotificationTypeDocument>(
    {
        name: {
            type: String,
            required: [true, "Notification type name is required"],
            trim: true,
            unique: true,
        },
        icon: {
            type: String,
            required: [true, "Notification type icon is required"],
            trim: true,
        },
        createdByUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Created by user is required"],
        },
    },
    { timestamps: true },
);

export const NotificationTypeModel = model<NotificationTypeDocument>(
    "NotificationType",
    notificationTypeSchema,
);
