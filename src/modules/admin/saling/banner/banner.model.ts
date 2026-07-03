import { Document, model, Schema, Types } from "mongoose";

export interface BannerDocument extends Document {
    product: Types.ObjectId;
    title: string;
    description?: string;
    thumbnail: string;
    isActive: boolean;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const bannerSchema = new Schema<BannerDocument>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [
                true,
                "Product is required",
            ],
        },
        title: {
            type: String,
            required: [
                true,
                "Banner title is required",
            ],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            required: false,
        },
        thumbnail: {
            type: String,
            required: [
                true,
                "Banner thumbnail is required",
            ],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
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

export const BannerModel = model<BannerDocument>(
    "Banner",
    bannerSchema,
);
