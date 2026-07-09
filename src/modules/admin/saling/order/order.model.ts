import { Document, model, Schema, Types } from "mongoose";

export interface OrderDocument extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "User is required",
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
    },
    {
        timestamps: true,
    },
);

orderSchema.index({ user: 1, product: 1 }, { unique: true });

export const OrderModel = model<OrderDocument>(
    "Order",
    orderSchema,
);
