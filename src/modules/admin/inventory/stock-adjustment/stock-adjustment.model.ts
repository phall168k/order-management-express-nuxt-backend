import { Document, model, Schema, Types } from "mongoose";

export interface StockAdjustmentDocument extends Document {
    code: string;
    stockAdjustmentDate: Date;
    product: Types.ObjectId;
    quantity: number;
    note?: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const stockAdjustmentSchema = new Schema<StockAdjustmentDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "Stock adjustment code is required",
            ],
            trim: true,
            unique: true,
        },
        stockAdjustmentDate: {
            type: Date,
            required: [
                true,
                "Stock adjustment date is required",
            ],
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [
                true,
                "Product is required",
            ],
        },
        quantity: {
            type: Number,
            required: [
                true,
                "Quantity is required",
            ],
            min: [
                1,
                "Quantity must be greater than 0",
            ],
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

export const StockAdjustmentModel = model<StockAdjustmentDocument>(
    "StockAdjustment",
    stockAdjustmentSchema,
);
