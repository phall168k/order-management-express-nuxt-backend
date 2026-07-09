import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isPositiveNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value > 0
);

export const validateCreateOrder = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product is required"));
    }

    if (!isPositiveNumber(req.body.quantity)) {
        return next(new HttpException(400, "Quantity must be a positive number"));
    }

    next();
};

export const validateUpdateOrder = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.product !== undefined && !isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product must be a non-empty string"));
    }

    if (req.body.quantity !== undefined && !isPositiveNumber(req.body.quantity)) {
        return next(new HttpException(400, "Quantity must be a positive number"));
    }

    next();
};
