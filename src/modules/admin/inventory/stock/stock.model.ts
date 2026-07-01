import { Document, model, Schema, Types } from "mongoose";

export interface StockDocument extends Document {
    product: Types.ObjectId;
    minStock: number;
    stockIn: number;
    stockOut: number;
    stockAdjustment: number;
    isStock: boolean;
    note?: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const stockSchema = new Schema<StockDocument>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [
                true,
                "Product is required",
            ],
            unique: true,
        },
        minStock: {
            type: Number,
            required: [
                true,
                "Minimum stock is required",
            ],
            min: [
                0,
                "Minimum stock must be greater than or equal to 0",
            ],
        },
        stockIn: {
            type: Number,
            required: [
                true,
                "Stock in is required",
            ],
            min: [
                0,
                "Stock in must be greater than or equal to 0",
            ],
        },
        stockOut: {
            type: Number,
            required: [
                true,
                "Stock out is required",
            ],
            min: [
                0,
                "Stock out must be greater than or equal to 0",
            ],
        },
        stockAdjustment: {
            type: Number,
            required: [
                true,
                "Stock adjustment is required",
            ],
            min: [
                0,
                "Stock adjustment must be greater than or equal to 0",
            ],
        },
        isStock: {
            type: Boolean,
            default: true,
        },
        note: {
            type: String,
            trim: true,
            required: false,
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

export const StockModel = model<StockDocument>(
    "Stock",
    stockSchema,
);
