import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isStringArray = (value: unknown): value is string[] => (
    Array.isArray(value) && value.every((item) => typeof item === "string")
);

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const isOptionalObjectId = (value: unknown) => (
    value === undefined || (typeof value === "string" && Types.ObjectId.isValid(value.trim()))
);

export const validateCreateUser = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.username)) {
        return next(new HttpException(400, "Username is required"));
    }

    if (!isNonEmptyString(req.body.email) || !emailPattern.test(req.body.email)) {
        return next(new HttpException(400, "Valid email is required"));
    }

    if (!isNonEmptyString(req.body.password) || req.body.password.length < 6) {
        return next(new HttpException(400, "Password must be at least 6 characters"));
    }

    if (req.body.roles !== undefined && !isStringArray(req.body.roles)) {
        return next(new HttpException(400, "Roles must be an array of role ids"));
    }

    if (!isOptionalObjectId(req.body.userProfile)) {
        return next(new HttpException(400, "User profile must be a valid user profile id"));
    }

    if (req.body.isSuperUser !== undefined && !isBoolean(req.body.isSuperUser)) {
        return next(new HttpException(400, "isSuperUser must be a boolean"));
    }

    if (req.body.isActive !== undefined && !isBoolean(req.body.isActive)) {
        return next(new HttpException(400, "isActive must be a boolean"));
    }

    next();
};

export const validateUpdateUser = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.username !== undefined && !isNonEmptyString(req.body.username)) {
        return next(new HttpException(400, "Username must be a non-empty string"));
    }

    if (
        req.body.email !== undefined
        && (!isNonEmptyString(req.body.email) || !emailPattern.test(req.body.email))
    ) {
        return next(new HttpException(400, "Email must be valid"));
    }

    if (
        req.body.password !== undefined
        && (!isNonEmptyString(req.body.password) || req.body.password.length < 6)
    ) {
        return next(new HttpException(400, "Password must be at least 6 characters"));
    }

    if (req.body.roles !== undefined && !isStringArray(req.body.roles)) {
        return next(new HttpException(400, "Roles must be an array of role ids"));
    }

    if (!isOptionalObjectId(req.body.userProfile)) {
        return next(new HttpException(400, "User profile must be a valid user profile id"));
    }

    if (req.body.isSuperUser !== undefined && !isBoolean(req.body.isSuperUser)) {
        return next(new HttpException(400, "isSuperUser must be a boolean"));
    }

    if (req.body.isActive !== undefined && !isBoolean(req.body.isActive)) {
        return next(new HttpException(400, "isActive must be a boolean"));
    }

    next();
};
