import { Document, model, Schema, Types } from "mongoose";
import { PaymentMethodCurrency } from "./dto/create-payment-method-request.dto";

export interface PaymentMethodDocument extends Document {
    logo?: string;
    bankAccount?: string;
    merchantName?: string;
    merchantCity?: string;
    amount?: number;
    currency: PaymentMethodCurrency;
    storeLabel?: string;
    phoneNumber?: string;
    billNumber?: string;
    terminalLabel?: string;
    isActive: boolean;
    createdByUser: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const paymentMethodSchema = new Schema<PaymentMethodDocument>(
    {
        logo: {
            type: String,
            trim: true,
            required: false,
        },
        bankAccount: {
            type: String,
            trim: true,
            required: false,
        },
        merchantName: {
            type: String,
            trim: true,
            required: false,
        },
        merchantCity: {
            type: String,
            trim: true,
            required: false,
        },
        amount: {
            type: Number,
            required: false,
            min: [
                0,
                "Amount must be greater than or equal to 0",
            ],
        },
        currency: {
            type: String,
            enum: [
                "usd",
                "khr",
            ],
            required: [
                true,
                "Currency is required",
            ],
        },
        storeLabel: {
            type: String,
            trim: true,
            required: false,
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: false,
        },
        billNumber: {
            type: String,
            trim: true,
            required: false,
        },
        terminalLabel: {
            type: String,
            trim: true,
            required: false,
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

export const PaymentMethodModel = model<PaymentMethodDocument>(
    "PaymentMethod",
    paymentMethodSchema,
);
