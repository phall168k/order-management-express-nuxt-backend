import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isOptionalBoolean = (value: unknown): value is boolean | undefined => (
    value === undefined || typeof value === "boolean"
);

export const validateCreateBanner = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product is required"));
    }

    if (!isNonEmptyString(req.body.title)) {
        return next(new HttpException(400, "Banner title is required"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Banner description must be a string"));
    }

    if (!isNonEmptyString(req.body.thumbnail)) {
        return next(new HttpException(400, "Banner thumbnail is required"));
    }

    if (!isOptionalBoolean(req.body.isActive)) {
        return next(new HttpException(400, "Banner active status must be a boolean"));
    }

    next();
};

export const validateUpdateBanner = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.product !== undefined && !isNonEmptyString(req.body.product)) {
        return next(new HttpException(400, "Product must be a non-empty string"));
    }

    if (req.body.title !== undefined && !isNonEmptyString(req.body.title)) {
        return next(new HttpException(400, "Banner title must be a non-empty string"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Banner description must be a string"));
    }

    if (req.body.thumbnail !== undefined && !isNonEmptyString(req.body.thumbnail)) {
        return next(new HttpException(400, "Banner thumbnail must be a non-empty string"));
    }

    if (!isOptionalBoolean(req.body.isActive)) {
        return next(new HttpException(400, "Banner active status must be a boolean"));
    }

    next();
};
