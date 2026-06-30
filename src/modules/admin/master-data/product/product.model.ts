import { Document, model, Schema, Types } from "mongoose";

export interface ProductDocument extends Document {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    description?: string;
    thumbnail: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "Product code is required",
            ],
            trim: true,
            unique: true,
        },
        nameEn: {
            type: String,
            required: [
                true,
                "Product English name is required",
            ],
            trim: true,
        },
        nameKh: {
            type: String,
            required: [
                true,
                "Product Khmer name is required",
            ],
            trim: true,
        },
        unitPrice: {
            type: Number,
            required: [
                true,
                "Product unit price is required",
            ],
            min: [
                0,
                "Product unit price must be greater than or equal to 0",
            ],
        },
        description: {
            type: String,
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [
                true,
                "Product thumbnail is required",
            ],
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

export const ProductModel = model<ProductDocument>(
    "Product",
    productSchema,
);
