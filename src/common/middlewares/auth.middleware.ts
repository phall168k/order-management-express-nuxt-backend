import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { jwtUtil, JwtUserPayload } from "../utils/jwt.util";

declare global {
    namespace Express {
        interface Request {
            user?: JwtUserPayload;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return next(new HttpException(401, "Unauthorized"));
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        req.user = jwtUtil.verify(token);

        next();
    } catch (_error) {
        return next(new HttpException(401, "Invalid or expired token"));
    }
};
