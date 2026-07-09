import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";

const userTypes = [
    "customer",
    "staff",
];

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

const isOptionalObjectId = (value: unknown) => (
    value === undefined || (typeof value === "string" && Types.ObjectId.isValid(value.trim()))
);

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

export const validateCreateUserProfile = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "User profile code is required"));
    }

    if (!isValidEnum(req.body.userType, userTypes)) {
        return next(new HttpException(400, "User profile type must be customer or staff"));
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

    if (!isOptionalString(req.body.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    if (req.body.profile !== undefined && !isMinioObject(req.body.profile)) {
        return next(new HttpException(400, "Profile must be a valid MinIO object"));
    }

    if (!isOptionalObjectId(req.body.createdByUser)) {
        return next(new HttpException(400, "Created by user must be a valid user id"));
    }

    next();
};

export const validateUpdateUserProfile = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (req.body.code !== undefined && !isNonEmptyString(req.body.code)) {
        return next(new HttpException(400, "User profile code must be a non-empty string"));
    }

    if (req.body.userType !== undefined && !isValidEnum(req.body.userType, userTypes)) {
        return next(new HttpException(400, "User profile type must be customer or staff"));
    }

    if (req.body.firstName !== undefined && !isNonEmptyString(req.body.firstName)) {
        return next(new HttpException(400, "First name must be a non-empty string"));
    }

    if (req.body.lastName !== undefined && !isNonEmptyString(req.body.lastName)) {
        return next(new HttpException(400, "Last name must be a non-empty string"));
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

    if (!isOptionalString(req.body.note)) {
        return next(new HttpException(400, "Note must be a string"));
    }

    if (req.body.profile !== undefined && !isMinioObject(req.body.profile)) {
        return next(new HttpException(400, "Profile must be a valid MinIO object"));
    }

    if (!isOptionalObjectId(req.body.createdByUser)) {
        return next(new HttpException(400, "Created by user must be a valid user id"));
    }

    next();
};
