import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const requiredStrings = ["title", "subject", "reciever", "notificationType", "link"];

export const validateCreateNotification = (req: Request, _res: Response, next: NextFunction) => {
    for (const field of requiredStrings) {
        if (!isNonEmptyString(req.body[field])) return next(new HttpException(400, `${field} is required`));
    }
    if (req.body.isSeen !== undefined && typeof req.body.isSeen !== "boolean") {
        return next(new HttpException(400, "isSeen must be a boolean"));
    }
    next();
};

export const validateUpdateNotification = (req: Request, _res: Response, next: NextFunction) => {
    for (const field of requiredStrings) {
        if (req.body[field] !== undefined && !isNonEmptyString(req.body[field])) {
            return next(new HttpException(400, `${field} must be a non-empty string`));
        }
    }
    if (req.body.isSeen !== undefined && typeof req.body.isSeen !== "boolean") {
        return next(new HttpException(400, "isSeen must be a boolean"));
    }
    next();
};
