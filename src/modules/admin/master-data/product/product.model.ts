import { Document, model, Schema, Types } from "mongoose";
import type { StockDocument } from "../../inventory/stock/stock.model";

export interface ProductDocument extends Document {
    code: string;
    nameEn: string;
    nameKh: string;
    unitPrice: number;
    discount: number;
    description?: string;
    thumbnail?: string;
    createdByUser: Types.ObjectId;
    category: Types.ObjectId;
    stock?: StockDocument | null;
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
            type: String,
            required: false,
            trim: true,
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
