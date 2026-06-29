import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

export const validateCreatePermission = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Permission name is required"));
    }

    next();
};

export const validateUpdatePermission = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.name !== undefined && !isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Permission name must be a non-empty string"));
    }

    next();
};
