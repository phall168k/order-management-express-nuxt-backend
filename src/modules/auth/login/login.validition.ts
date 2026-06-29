import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../../common/exceptions/http.exception";

const isNonEmptyString = (value: unknown): value is string => (
    typeof value === "string" && value.trim().length > 0
);

export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (!isNonEmptyString(req.body.usernameOrEmail)) {
        return next(new HttpException(400, "Username or email is required"));
    }

    if (!isNonEmptyString(req.body.password)) {
        return next(new HttpException(400, "Password is required"));
    }

    next();
};
