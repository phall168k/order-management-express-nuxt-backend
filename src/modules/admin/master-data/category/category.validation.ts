import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

export const validateCreateCategory = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "Category code is required"));
    }

    if (!isNonEmptyString(req.body.nameEn)) {
        return next(new HttpException(400, "Category English name is required"));
    }

    if (!isNonEmptyString(req.body.nameKh)) {
        return next(new HttpException(400, "Category Khmer name is required"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Category description must be a string"));
    }

    if (!isOptionalString(req.body.icon)) {
        return next(new HttpException(400, "Category icon must be a string"));
    }

    next();
};

export const validateUpdateCategory = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.code !== undefined && !isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "Category code must be a non-empty string"));
    }

    if (req.body.nameEn !== undefined && !isNonEmptyString(req.body.nameEn)) {
        return next(new HttpException(400, "Category English name must be a non-empty string"));
    }

    if (req.body.nameKh !== undefined && !isNonEmptyString(req.body.nameKh)) {
        return next(new HttpException(400, "Category Khmer name must be a non-empty string"));
    }

    if (!isOptionalString(req.body.description)) {
        return next(new HttpException(400, "Category description must be a string"));
    }

    if (!isOptionalString(req.body.icon)) {
        return next(new HttpException(400, "Category icon must be a string"));
    }

    next();
};
