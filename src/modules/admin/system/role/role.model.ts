import { Document, model, Schema, Types } from "mongoose";

export interface RoleDocument extends Document {
    name: string;
    permissions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<RoleDocument>(
    {
        name: {
            type: String,
            required: [
                true,
                "Role name is required",
            ],
            trim: true,
            unique: true,
        },
        permissions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Permission",
            },
        ],
    },
    {
        timestamps: true,
    },
);

export const RoleModel = model<RoleDocument>(
    "Role",
    roleSchema,
);
