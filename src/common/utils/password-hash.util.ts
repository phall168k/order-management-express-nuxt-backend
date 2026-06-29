import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const passwordHashUtil = {
    hash(password: string) {
        return bcrypt.hash(password, SALT_ROUNDS);
    },

    verify(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    },
};
