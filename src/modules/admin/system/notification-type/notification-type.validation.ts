import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

export const validateCreateNotificationType = (req: Request, _res: Response, next: NextFunction) => {
    if (!isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Notification type name is required"));
    }
    if (!isNonEmptyString(req.body.icon)) {
        return next(new HttpException(400, "Notification type icon is required"));
    }
    next();
};

export const validateUpdateNotificationType = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body.name !== undefined && !isNonEmptyString(req.body.name)) {
        return next(new HttpException(400, "Notification type name must be a non-empty string"));
    }
    if (req.body.icon !== undefined && !isNonEmptyString(req.body.icon)) {
        return next(new HttpException(400, "Notification type icon must be a non-empty string"));
    }
    next();
};
