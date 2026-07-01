import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isNonNegativeNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value >= 0
);

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

export const validateCreateStock = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product is required"));
    }

    if (!isNonNegativeNumber(req.body.minStock)) {
        return next(new HttpException(400, "Minimum stock must be a non-negative number"));
    }

    if (!isNonNegativeNumber(req.body.stockIn)) {
        return next(new HttpException(400, "Stock in must be a non-negative number"));
    }

    if (!isNonNegativeNumber(req.body.stockOut)) {
        return next(new HttpException(400, "Stock out must be a non-negative number"));
    }

    if (!isNonNegativeNumber(req.body.stockAdjustment)) {
        return next(new HttpException(400, "Stock adjustment must be a non-negative number"));
    }

    if (req.body.isStock !== undefined && !isBoolean(req.body.isStock)) {
        return next(new HttpException(400, "isStock must be a boolean"));
    }

    if (!isOptionalString(req.body.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    next();
};

export const validateUpdateStock = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.product !== undefined && !isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product must be a non-empty string"));
    }

    if (req.body.minStock !== undefined && !isNonNegativeNumber(req.body.minStock)) {
        return next(new HttpException(400, "Minimum stock must be a non-negative number"));
    }

    if (req.body.stockIn !== undefined && !isNonNegativeNumber(req.body.stockIn)) {
        return next(new HttpException(400, "Stock in must be a non-negative number"));
    }

    if (req.body.stockOut !== undefined && !isNonNegativeNumber(req.body.stockOut)) {
        return next(new HttpException(400, "Stock out must be a non-negative number"));
    }

    if (req.body.stockAdjustment !== undefined && !isNonNegativeNumber(req.body.stockAdjustment)) {
        return next(new HttpException(400, "Stock adjustment must be a non-negative number"));
    }

    if (req.body.isStock !== undefined && !isBoolean(req.body.isStock)) {
        return next(new HttpException(400, "isStock must be a boolean"));
    }

    if (!isOptionalString(req.body.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    next();
};
