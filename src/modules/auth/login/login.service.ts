import { Types } from "mongoose";
import { jwtUtil } from "../../../common/utils/jwt.util";
import { passwordHashUtil } from "../../../common/utils/password-hash.util";
import { LoginRequestDto } from "./dto/login-request.dto";
import { loginRepository } from "./login.repository";

type PlainObject = Record<string, unknown>;

const normalizeUsernameOrEmail = (usernameOrEmail: string) => (
    usernameOrEmail.trim().toLowerCase()
);

const getDocumentId = (document: PlainObject) => {
    const id = document._id;

    return id instanceof Types.ObjectId ? id.toString() : String(id);
};

const getPermissionNames = (roles: unknown[]) => {
    const permissions = roles.flatMap((role) => {
        const roleObject = role as PlainObject;
        const rolePermissions = roleObject.permissions;

        if (!Array.isArray(rolePermissions)) {
            return [];
        }

        return rolePermissions
            .map((permission) => (permission as PlainObject).name)
            .filter((permissionName): permissionName is string => typeof permissionName === "string");
    });

    return [...new Set(permissions)];
};

export const loginService = {
    async login(data: LoginRequestDto) {
        const usernameOrEmail = normalizeUsernameOrEmail(data.usernameOrEmail);
        const user = await loginRepository.findByUsernameOrEmail(usernameOrEmail);

        if (!user) {
            throw new Error("Invalid username/email or password");
        }

        const isPasswordValid = await passwordHashUtil.verify(data.password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid username/email or password");
        }

        if (!user.isActive) {
            throw new Error("User is inactive");
        }

        const userObject = user.toObject() as unknown as PlainObject;
        const roles = Array.isArray(userObject.roles) ? userObject.roles : [];
        const permissions = getPermissionNames(roles);
        const tokenPayload = {
            _id: getDocumentId(userObject),
            username: user.username,
            email: user.email,
            isSuperUser: user.isSuperUser,
            isActive: user.isActive,
        };

        const token = jwtUtil.generate(tokenPayload);

        return {
            token,
            user: {
                _id: tokenPayload._id,
                username: user.username,
                email: user.email,
                isActive: user.isActive,
                isSuperUser: user.isSuperUser,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                roles,
                permission: permissions,
            },
        };
    },
};
