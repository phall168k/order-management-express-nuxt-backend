import jwt, { SignOptions } from "jsonwebtoken";

export interface JwtUserPayload {
    _id: string;
    username: string;
    email: string;
    isSuperUser: boolean;
    isActive: boolean;
}

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is required");
    }

    return secret;
};

export const jwtUtil = {
    generate(payload: JwtUserPayload) {
        const options: SignOptions = {
            expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"],
        };

        return jwt.sign(payload, getJwtSecret(), options);
    },

    verify(token: string) {
        return jwt.verify(token, getJwtSecret()) as JwtUserPayload;
    },
};
