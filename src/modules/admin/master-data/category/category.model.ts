import { Document, model, Schema, Types } from "mongoose";

export interface CategoryDocument extends Document {
    code: string;
    nameEn: string;
    nameKh: string;
    icon?: string;
    description?: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "Category code is required",
            ],
            trim: true,
            unique: true,
        },
        nameEn: {
            type: String,
            required: [
                true,
                "Category English name is required",
            ],
            trim: true,
        },
        nameKh: {
            type: String,
            required: [
                true,
                "Category Khmer name is required",
            ],
            trim: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        createdByUser: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Created by user is required",
            ],
        },
    },
    {
        timestamps: true,
    },
);

export const CategoryModel = model<CategoryDocument>(
    "Category",
    categorySchema,
);
