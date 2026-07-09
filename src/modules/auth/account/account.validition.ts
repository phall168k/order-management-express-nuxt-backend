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

const isPlainObject = (value: unknown): value is Record<string, unknown> => (
    typeof value === "object" && value !== null && !Array.isArray(value)
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

const isNonNegativeNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value >= 0
);

const isMinioObject = (value: unknown) => {
    if (!isPlainObject(value)) {
        return false;
    }

    return isNonEmptyString(value.bucket)
        && isNonEmptyString(value.objectName)
        && isNonEmptyString(value.url)
        && (value.originalName === undefined || typeof value.originalName === "string")
        && (value.mimeType === undefined || typeof value.mimeType === "string")
        && (value.etag === undefined || typeof value.etag === "string")
        && (value.size === undefined || isNonNegativeNumber(value.size));
};

export const validateChangePassword = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.currentPassword)) {
        return next(new HttpException(400, "Current password is required"));
    }

    if (!isNonEmptyString(req.body.newPassword) || req.body.newPassword.length < 6) {
        return next(new HttpException(400, "New password must be at least 6 characters"));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new HttpException(400, "New password and confirm password do not match"));
    }

    next();
};

export const validateUpdateAccount = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isPlainObject(req.body)) {
        return next(new HttpException(400, "Request body must be an object"));
    }

    if (req.body.user !== undefined && !isPlainObject(req.body.user)) {
        return next(new HttpException(400, "User must be an object"));
    }

    if (req.body.userProfile !== undefined && !isPlainObject(req.body.userProfile)) {
        return next(new HttpException(400, "User profile must be an object"));
    }

    const user = isPlainObject(req.body.user) ? req.body.user : {};
    const userProfile = isPlainObject(req.body.userProfile) ? req.body.userProfile : {};

    if (user.username !== undefined && !isNonEmptyString(user.username)) {
        return next(new HttpException(400, "Username must be a non-empty string"));
    }

    if (
        user.email !== undefined
        && (!isNonEmptyString(user.email) || !emailPattern.test(user.email))
    ) {
        return next(new HttpException(400, "Email must be valid"));
    }

    if (userProfile.firstName !== undefined && !isNonEmptyString(userProfile.firstName)) {
        return next(new HttpException(400, "First name must be a non-empty string"));
    }

    if (userProfile.lastName !== undefined && !isNonEmptyString(userProfile.lastName)) {
        return next(new HttpException(400, "Last name must be a non-empty string"));
    }

    if (userProfile.gender !== undefined && !isValidEnum(userProfile.gender, genders)) {
        return next(new HttpException(400, "Gender must be male, female, or other"));
    }

    if (!isOptionalDate(userProfile.dob)) {
        return next(new HttpException(400, "Date of birth must be a valid date"));
    }

    if (!isOptionalString(userProfile.phoneNumber)) {
        return next(new HttpException(400, "Phone number must be a string"));
    }

    if (!isOptionalString(userProfile.address)) {
        return next(new HttpException(400, "Address must be a string"));
    }

    if (!isOptionalString(userProfile.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    if (userProfile.profile !== undefined && !isMinioObject(userProfile.profile)) {
        return next(new HttpException(400, "Profile must be a valid MinIO object"));
    }

    next();
};
