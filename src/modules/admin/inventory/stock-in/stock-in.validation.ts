import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { CreateStockInItemRequestDto } from "./dto/create-stock-in-request.dto";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isPositiveNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value > 0
);

const isValidDateString = (value: unknown): value is string => (
    isNonEmptyString(value) && !Number.isNaN(new Date(value).getTime())
);

const getCreateItems = (body: unknown): CreateStockInItemRequestDto[] | null => {
    if (Array.isArray(body)) {
        return body;
    }

    if (
        typeof body === "object"
        && body !== null
        && "items" in body
        && Array.isArray((body as { items?: unknown }).items)
    ) {
        return (body as { items: CreateStockInItemRequestDto[] }).items;
    }

    return null;
};

export const validateCreateStockIn = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const items = getCreateItems(req.body);

    if (!items || items.length === 0) {
        return next(new HttpException(400, "Stock in items are required"));
    }

    for (const item of items) {
        if (!isValidDateString(item.stockInDate)) {
            return next(new HttpException(400, "Stock in date is required"));
        }

        if (!isNonEmptyString(item.product)) {
            return next(new HttpException(400, "Product is required"));
        }

        if (!isPositiveNumber(item.quantity)) {
            return next(new HttpException(400, "Quantity must be a positive number"));
        }

        if (!isOptionalString(item.note)) {
            return next(new HttpException(400, "Note must be a string"));
        }
    }

    next();
};

export const validateUpdateStockIn = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.stockInDate !== undefined && !isValidDateString(req.body.stockInDate)) {
        return next(new HttpException(400, "Stock in date must be a valid date"));
    }

    if (req.body.product !== undefined && !isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product must be a non-empty string"));
    }

    if (req.body.quantity !== undefined && !isPositiveNumber(req.body.quantity)) {
        return next(new HttpException(400, "Quantity must be a positive number"));
    }

    if (!isOptionalString(req.body.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    next();
};
