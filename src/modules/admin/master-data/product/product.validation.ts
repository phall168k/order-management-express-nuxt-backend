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

export const validateCreateProduct = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "Product code is required"));
    }

    if (!isNonEmptyString(req.body.nameEn)) {
        return next(new HttpException(400, "Product English name is required"));
    }

    if (!isNonEmptyString(req.body.nameKh)) {
        return next(new HttpException(400, "Product Khmer name is required"));
    }

    if (!isNonNegativeNumber(req.body.unitPrice)) {
        return next(new HttpException(400, "Product unit price must be a non-negative number"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Product description must be a string"));
    }

    if (!isNonEmptyString(req.body.thumbnail)) {
        return next(new HttpException(400, "Product thumbnail is required"));
    }

    next();
};

export const validateUpdateProduct = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.code !== undefined && !isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "Product code must be a non-empty string"));
    }

    if (req.body.nameEn !== undefined && !isNonEmptyString(req.body.nameEn)) {
        return next(new HttpException(400, "Product English name must be a non-empty string"));
    }

    if (req.body.nameKh !== undefined && !isNonEmptyString(req.body.nameKh)) {
        return next(new HttpException(400, "Product Khmer name must be a non-empty string"));
    }

    if (req.body.unitPrice !== undefined && !isNonNegativeNumber(req.body.unitPrice)) {
        return next(new HttpException(400, "Product unit price must be a non-negative number"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Product description must be a string"));
    }

    if (req.body.thumbnail !== undefined && !isNonEmptyString(req.body.thumbnail)) {
        return next(new HttpException(400, "Product thumbnail must be a non-empty string"));
    }

    next();
};
