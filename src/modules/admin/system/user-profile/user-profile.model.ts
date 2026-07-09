import { Document, model, Schema, Types } from "mongoose";

export type UserProfileUserType = "customer" | "staff";
export type UserProfileGender = "male" | "female" | "other";

export interface UserProfileMinioObject {
    bucket: string;
    objectName: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    etag?: string;
    url: string;
}

export interface UserProfileDocument extends Document {
    code: string;
    userType: UserProfileUserType;
    firstName: string;
    lastName: string;
    gender?: UserProfileGender;
    dob?: Date;
    phoneNumber?: string;
    address?: string;
    note?: string;
    profile?: UserProfileMinioObject;
    createdByUser?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const userProfileMinioObjectSchema = new Schema<UserProfileMinioObject>(
    {
        bucket: {
            type: String,
            required: true,
            trim: true,
        },
        objectName: {
            type: String,
            required: true,
            trim: true,
        },
        originalName: {
            type: String,
            trim: true,
        },
        mimeType: {
            type: String,
            trim: true,
        },
        size: {
            type: Number,
            min: 0,
        },
        etag: {
            type: String,
            trim: true,
        },
        url: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        _id: false,
    },
);

const userProfileSchema = new Schema<UserProfileDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "User profile code is required",
            ],
            trim: true,
            unique: true,
        },
        userType: {
            type: String,
            required: [
                true,
                "User profile type is required",
            ],
            enum: [
                "customer",
                "staff",
            ],
        },
        firstName: {
            type: String,
            required: [
                true,
                "First name is required",
            ],
            trim: true,
        },
        lastName: {
            type: String,
            required: [
                true,
                "Last name is required",
            ],
            trim: true,
        },
        gender: {
            type: String,
            enum: [
                "male",
                "female",
                "other",
            ],
            required: false,
        },
        dob: {
            type: Date,
            required: false,
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: false,
        },
        address: {
            type: String,
            trim: true,
            required: false,
        },
        note: {
            type: String,
            trim: true,
            required: false,
        },
        profile: {
            type: userProfileMinioObjectSchema,
            required: false,
        },
        createdByUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

export const UserProfileModel = model<UserProfileDocument>(
    "UserProfile",
    userProfileSchema,
);
