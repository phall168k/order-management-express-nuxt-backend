import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../../common/exceptions/http.exception";

const currencies = ["usd", "khr"];

const isOptionalString = (value: unknown): value is string | undefined => (
    value === undefined || typeof value === "string"
);

const isCurrency = (value: unknown): value is "usd" | "khr" => (
    typeof value === "string" && currencies.includes(value)
);

const isNonNegativeNumber = (value: unknown): value is number => (
    typeof value === "number" && Number.isFinite(value) && value >= 0
);

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

const validateOptionalFields = (body: Record<string, unknown>) => {
    const optionalStringFields = [
        "logo",
        "bankAccount",
        "merchantName",
        "merchantCity",
        "storeLabel",
        "phoneNumber",
        "billNumber",
        "terminalLabel",
    ];

    for (const field of optionalStringFields) {
        if (!isOptionalString(body[field])) {
            throw new HttpException(400, `${field} must be a string`);
        }
    }

    if (body.amount !== undefined && !isNonNegativeNumber(body.amount)) {
        throw new HttpException(400, "Amount must be a non-negative number");
    }

    if (body.isActive !== undefined && !isBoolean(body.isActive)) {
        throw new HttpException(400, "isActive must be a boolean");
    }
};

export const validateCreatePaymentMethod = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!isCurrency(req.body.currency)) {
            return next(new HttpException(400, "Currency must be usd or khr"));
        }

        validateOptionalFields(req.body);

        next();
    } catch (error) {
        next(error);
    }
};

export const validateUpdatePaymentMethod = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (req.body.currency !== undefined && !isCurrency(req.body.currency)) {
            return next(new HttpException(400, "Currency must be usd or khr"));
        }

        validateOptionalFields(req.body);

        next();
    } catch (error) {
        next(error);
    }
};
