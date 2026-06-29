import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { HttpException } from "../exceptions/http.exception";

const getStatusFromMessage = (message: string) => {
    if (message.includes("JWT_SECRET")) {
        return 500;
    }

    if (message.includes("not found")) {
        return 404;
    }

    if (message.includes("already exists")) {
        return 409;
    }

    if (message.includes("Invalid username/email or password")) {
        return 401;
    }

    if (message.includes("inactive") || message.includes("Permission denied")) {
        return 403;
    }

    if (message.includes("Invalid") || message.includes("required")) {
        return 400;
    }

    return 500;
};

const getErrorResponse = (error: unknown) => {
    if (error instanceof HttpException) {
        return {
            statusCode: error.statusCode,
            message: error.message,
            errors: error.errors,
        };
    }

    if (error instanceof MongooseError.ValidationError) {
        return {
            statusCode: 400,
            message: "Validation error",
            errors: error.errors,
        };
    }

    if (error instanceof MongooseError.CastError) {
        return {
            statusCode: 400,
            message: "Invalid id",
        };
    }

    if (error instanceof TokenExpiredError) {
        return {
            statusCode: 401,
            message: "Token expired",
        };
    }

    if (error instanceof JsonWebTokenError) {
        return {
            statusCode: 401,
            message: "Invalid token",
        };
    }

    if (
        typeof error === "object"
        && error !== null
        && "code" in error
        && error.code === 11000
    ) {
        return {
            statusCode: 409,
            message: "Duplicate data already exists",
        };
    }

    if (error instanceof Error) {
        return {
            statusCode: getStatusFromMessage(error.message),
            message: error.message,
        };
    }

    return {
        statusCode: 500,
        message: "Internal server error",
    };
};

export const notFoundMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    next(new HttpException(404, `Route ${req.originalUrl} not found`));
};

export const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    const { statusCode, message, errors } = getErrorResponse(error);

    return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message,
        ...(errors ? { errors } : {}),
    });
};
