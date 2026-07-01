import { Document, model, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    roles: Types.ObjectId[];
    userProfile?: Types.ObjectId;
    isSuperUser: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: [
                true,
                "Username is required",
            ],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [
                true,
                "Email is required",
            ],
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [
                true,
                "Password is required",
            ],
            select: false,
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        userProfile: {
            type: Schema.Types.ObjectId,
            ref: "UserProfile",
            required: false,
        },
        isSuperUser: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete (ret as { password?: string }).password;
                return ret;
            },
        },
        toObject: {
            transform: (_doc, ret) => {
                delete (ret as { password?: string }).password;
                return ret;
            },
        },
    },
);

export const UserModel = model<UserDocument>(
    "User",
    userSchema,
);
