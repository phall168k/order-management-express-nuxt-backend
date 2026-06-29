import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isStringArray = (value: unknown): value is string[] => (
    Array.isArray(value) && value.every((item) => typeof item === "string")
);

export const validateCreateRole = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Role name is required"));
    }

    if (req.body.permissions !== undefined && !isStringArray(req.body.permissions)) {
        return next(new HttpException(400, "Permissions must be an array of permission ids"));
    }

    next();
};

export const validateUpdateRole = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.name !== undefined && !isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Role name must be a non-empty string"));
    }

    if (req.body.permissions !== undefined && !isStringArray(req.body.permissions)) {
        return next(new HttpException(400, "Permissions must be an array of permission ids"));
    }

    next();
};
