import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";
import { UserModel } from "../../modules/admin/system/user/user.model";

type PopulatedPermission = {
    name?: unknown;
};

type PopulatedRole = {
    permissions?: PopulatedPermission[];
};

type AuthUser = {
    isActive?: boolean;
    isSuperUser?: boolean;
    roles?: PopulatedRole[];
};

const getUserPermissions = (user: AuthUser) => {
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const permissions = roles.flatMap((role) => {
        const rolePermissions = Array.isArray(role.permissions)
            ? role.permissions
            : [];

        return rolePermissions
            .map((permission) => permission.name)
            .filter((permissionName): permissionName is string => typeof permissionName === "string");
    });

    return new Set(permissions);
};

export const permissionMiddleware = (...requiredPermissions: string[]) => (
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new HttpException(401, "Unauthorized"));
        }

        const user = await UserModel.findById(req.user._id)
            .populate({
                path: "roles",
                populate: {
                    path: "permissions",
                    select: "name",
                },
            });

        if (!user) {
            return next(new HttpException(401, "Unauthorized"));
        }

        const authUser = user.toObject() as unknown as AuthUser;

        if (!authUser.isActive) {
            return next(new HttpException(403, "User is inactive"));
        }

        if (authUser.isSuperUser) {
            return next();
        }

        const userPermissions = getUserPermissions(authUser);
        const hasPermission = requiredPermissions.every((permission) => (
            userPermissions.has(permission)
        ));

        if (!hasPermission) {
            return next(new HttpException(403, "Permission denied"));
        }

        next();
    }
);
