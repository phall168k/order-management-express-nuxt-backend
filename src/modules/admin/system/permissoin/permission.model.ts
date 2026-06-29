import { Document, model, Schema } from "mongoose";

export interface PermissionDocument extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const permissionSchema = new Schema<PermissionDocument>(
    {
        name: {
            type: String,
            required: [
                true,
                'Permission name is required',
            ],
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

export const PermissionModel = model<PermissionDocument>(
    'Permission',
    permissionSchema,
);
