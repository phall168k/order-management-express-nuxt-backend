import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const statuses = ["pending", "packing", "shipping", "delivered", "completed"];

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isPositiveNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value > 0
);

const isNonNegativeNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value >= 0
);

const isStatus = (value: unknown): value is string => (
    typeof value === "string" && statuses.includes(value)
);

const isValidDateString = (value: unknown): value is string => (
    isNonEmptyString(value) && !Number.isNaN(new Date(value).getTime())
);

const validateItems = (items: unknown) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new HttpException(400, "Sale items are required");
    }

    for (const item of items) {
        if (typeof item !== "object" || item === null) {
            throw new HttpException(400, "Sale item must be an object");
        }

        const saleItem = item as Record<string, unknown>;

        if (!isNonEmptyString(saleItem.product)) {
            throw new HttpException(400, "Product is required");
        }

        if (!isPositiveNumber(saleItem.quantity)) {
            throw new HttpException(400, "Quantity must be a positive number");
        }

        if (!isNonNegativeNumber(saleItem.unitPrice)) {
            throw new HttpException(400, "Unit price must be a non-negative number");
        }

        if (!isNonNegativeNumber(saleItem.discount)) {
            throw new HttpException(400, "Discount must be a non-negative number");
        }

        if (saleItem.discount > saleItem.unitPrice) {
            throw new HttpException(400, "Discount must not be greater than unit price");
        }

        if (!isOptionalString(saleItem.note)) {
            throw new HttpException(400, "Item note must be a string");
        }
    }
};

export const validateCreateSale = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!isNonEmptyString(req.body.code)) {
            return next(new HttpException(400, "Sale code is required"));
        }

        if (!isNonEmptyString(req.body.customer)) {
            return next(new HttpException(400, "Customer is required"));
        }

        if (!isValidDateString(req.body.salingDate)) {
            return next(new HttpException(400, "Saling date is required"));
        }

        if (!isStatus(req.body.status)) {
            return next(new HttpException(400, "Status is required"));
        }

        if (!isNonEmptyString(req.body.paymentMethod)) {
            return next(new HttpException(400, "Payment method is required"));
        }

        if (!isNonEmptyString(req.body.address)) {
            return next(new HttpException(400, "Address is required"));
        }

        if (!isOptionalString(req.body.note)) {
            return next(new HttpException(400, "Note must be a string"));
        }

        validateItems(req.body.items);

        next();
    } catch (error) {
        next(error);
    }
};

export const validateUpdateSale = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (req.body.code !== undefined && !isNonEmptyString(req.body.code)) {
            return next(new HttpException(400, "Sale code must be a non-empty string"));
        }

        if (req.body.customer !== undefined && !isNonEmptyString(req.body.customer)) {
            return next(new HttpException(400, "Customer must be a non-empty string"));
        }

        if (req.body.salingDate !== undefined && !isValidDateString(req.body.salingDate)) {
            return next(new HttpException(400, "Saling date must be a valid date"));
        }

        if (req.body.status !== undefined && !isStatus(req.body.status)) {
            return next(new HttpException(400, "Invalid status"));
        }

        if (req.body.paymentMethod !== undefined && !isNonEmptyString(req.body.paymentMethod)) {
            return next(new HttpException(400, "Payment method must be a non-empty string"));
        }

        if (req.body.address !== undefined && !isNonEmptyString(req.body.address)) {
            return next(new HttpException(400, "Address must be a non-empty string"));
        }

        if (!isOptionalString(req.body.note)) {
            return next(new HttpException(400, "Note must be a string"));
        }

        if (req.body.items !== undefined) {
            validateItems(req.body.items);
        }

        next();
    } catch (error) {
        next(error);
    }
};
