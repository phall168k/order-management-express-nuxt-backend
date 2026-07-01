import { Document, model, Schema, Types } from "mongoose";

export interface StockInDocument extends Document {
    code: string;
    stockInDate: Date;
    product: Types.ObjectId;
    quantity: number;
    note?: string;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const stockInSchema = new Schema<StockInDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "Stock in code is required",
            ],
            trim: true,
            unique: true,
        },
        stockInDate: {
            type: Date,
            required: [
                true,
                "Stock in date is required",
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

export const StockInModel = model<StockInDocument>(
    "StockIn",
    stockInSchema,
);
