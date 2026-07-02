import { Document, model, Schema, Types } from "mongoose";
import { SaleStatus } from "./dto/create-sale-request.dto";

export interface SaleItem {
    product: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    discount: number;
    note?: string;
}

export interface SaleDocument extends Document {
    code: string;
    customer: Types.ObjectId;
    salingDate: Date;
    createdByUser: Types.ObjectId;
    status: SaleStatus;
    paymentMethod: Types.ObjectId;
    address: string;
    note?: string;
    items: SaleItem[];
    createdAt: Date;
    updatedAt: Date;
}

const saleItemSchema = new Schema<SaleItem>(
    {
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
        unitPrice: {
            type: Number,
            required: [
                true,
                "Unit price is required",
            ],
            min: [
                0,
                "Unit price must be greater than or equal to 0",
            ],
        },
        discount: {
            type: Number,
            required: [
                true,
                "Discount is required",
            ],
            min: [
                0,
                "Discount must be greater than or equal to 0",
            ],
        },
        note: {
            type: String,
            trim: true,
            required: false,
        },
    },
    {
        _id: false,
    },
);

const saleSchema = new Schema<SaleDocument>(
    {
        code: {
            type: String,
            required: [
                true,
                "Sale code is required",
            ],
            trim: true,
            unique: true,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [
                true,
                "Customer is required",
            ],
        },
        salingDate: {
            type: Date,
            required: [
                true,
                "Saling date is required",
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
        status: {
            type: String,
            enum: [
                "pending",
                "packing",
                "shipping",
                "delivered",
                "completed",
            ],
            required: [
                true,
                "Status is required",
            ],
            default: "pending",
        },
        paymentMethod: {
            type: Schema.Types.ObjectId,
            ref: "PaymentMethod",
            required: [
                true,
                "Payment method is required",
            ],
        },
        address: {
            type: String,
            required: [
                true,
                "Address is required",
            ],
            trim: true,
        },
        note: {
            type: String,
            trim: true,
            required: false,
        },
        items: {
            type: [saleItemSchema],
            required: [
                true,
                "Sale items are required",
            ],
            validate: {
                validator(items: SaleItem[]) {
                    return items.length > 0;
                },
                message: "Sale items are required",
            },
        },
    },
    {
        timestamps: true,
    },
);

saleItemSchema.pre("validate", function validateDiscount() {
    if (this.discount > this.unitPrice) {
        this.invalidate("discount", "Discount must not be greater than unit price");
    }
});

export const SaleModel = model<SaleDocument>(
    "Sale",
    saleSchema,
);
