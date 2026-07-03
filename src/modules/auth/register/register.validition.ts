import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../common/exceptions/http.exception";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const genders = [
    "male",
    "female",
    "other",
];

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isValidEnum = (value: unknown, options: string[]) => (
    typeof value === "string" && options.includes(value)
);

const isOptionalDate = (value: unknown) => {
    if (value === undefined) {
        return true;
    }

    if (value instanceof Date) {
        return !Number.isNaN(value.getTime());
    }

    return typeof value === "string"
        && value.trim().length > 0
        && !Number.isNaN(new Date(value).getTime());
};

export const validateRegister = (
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

    if (!isNonEmptyString(req.body.firstName)) {
        return next(new HttpException(400, "First name is required"));
    }

    if (!isNonEmptyString(req.body.lastName)) {
        return next(new HttpException(400, "Last name is required"));
    }

    if (req.body.gender !== undefined && !isValidEnum(req.body.gender, genders)) {
        return next(new HttpException(400, "Gender must be male, female, or other"));
    }

    if (!isOptionalDate(req.body.dob)) {
        return next(new HttpException(400, "Date of birth must be a valid date"));
    }

    if (!isOptionalString(req.body.phoneNumber)) {
        return next(new HttpException(400, "Phone number must be a string"));
    }

    if (!isOptionalString(req.body.address)) {
        return next(new HttpException(400, "Address must be a string"));
    }

    if (!isOptionalString(req.body.profile)) {
        return next(new HttpException(400, "Profile must be a string"));
    }

    next();
};
