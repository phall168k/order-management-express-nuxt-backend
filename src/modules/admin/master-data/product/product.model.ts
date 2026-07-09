import { Document, model, Schema, Types } from "mongoose";
import type { StockDocument } from "../../inventory/stock/stock.model";

export interface ProductThumbnail {
    bucket: string;
    objectName: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    etag?: string;
    url: string;
}

export interface ProductDocument extends Document {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    discount: number;
    description?: string;
    thumbnail?: ProductThumbnail;
    createdByUser: Types.ObjectId;
    category: Types.ObjectId;
    stock?: StockDocument | null;
    createdAt: Date;
    updatedAt: Date;
}

const productThumbnailSchema = new Schema<ProductThumbnail>(
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
        discount: {
            type: Number,
            default: 0,
            min: [
                0,
                "Product discount must be greater than or equal to 0",
            ],
        },
        description: {
            type: String,
            trim: true,
        },
        thumbnail: {
            type: productThumbnailSchema,
            required: false,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [
                true,
                "Category is required",
            ],
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

productSchema.pre("validate", function validateDiscount() {
    if (this.discount > this.unitPrice) {
        this.invalidate("discount", "Product discount must not be greater than unit price");
    }
});

productSchema.virtual("stock", {
    ref: "Stock",
    localField: "_id",
    foreignField: "product",
    justOne: true,
});

export const ProductModel = model<ProductDocument>(
    "Product",
    productSchema,
);
