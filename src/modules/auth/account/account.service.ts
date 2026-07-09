import { Types } from "mongoose";
import { HttpException } from "../../../common/exceptions/http.exception";
import { jwtUtil } from "../../../common/utils/jwt.util";
import { passwordHashUtil } from "../../../common/utils/password-hash.util";
import { UserProfileMinioObject } from "../../admin/system/user-profile/user-profile.model";
import { accountRepository } from "./account.repository";
import { ChangePasswordRequestDto } from "./dto/change-password-request.dto";
import {
    UpdateAccountRequestDto,
    UpdateAccountUserProfileRequestDto,
    UpdateAccountUserRequestDto,
} from "./dto/update-account-request.dto";

type PlainObject = Record<string, unknown>;

const normalizeUsername = (username: string) => username.trim();
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizeOptionalDate = (value?: string | Date) => {
    if (value === undefined) {
        return undefined;
    }

    return value instanceof Date ? value : new Date(value);
};

const normalizeMinioObject = (value: UserProfileMinioObject): UserProfileMinioObject => ({
    bucket: normalizeString(value.bucket),
    objectName: normalizeString(value.objectName),
    originalName: normalizeOptionalString(value.originalName),
    mimeType: normalizeOptionalString(value.mimeType),
    size: value.size,
    etag: normalizeOptionalString(value.etag),
    url: normalizeString(value.url),
});

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

const buildAuthUserResponse = (user: { toObject: () => unknown; username: string; email: string; isActive: boolean; isSuperUser: boolean; createdAt: Date; updatedAt: Date }) => {
    const userObject = user.toObject() as PlainObject;
    const roles = Array.isArray(userObject.roles) ? userObject.roles : [];
    const permissions = getPermissionNames(roles);
    const tokenPayload = {
        _id: getDocumentId(userObject),
        username: user.username,
        email: user.email,
        isSuperUser: user.isSuperUser,
        isActive: user.isActive,
    };

    return {
        token: jwtUtil.generate(tokenPayload),
        user: {
            _id: tokenPayload._id,
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            isSuperUser: user.isSuperUser,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles,
            userProfile: userObject.userProfile ?? null,
            permission: permissions,
        },
    };
};

const normalizeUserUpdate = async (userId: string, data?: UpdateAccountUserRequestDto) => {
    const updateData: UpdateAccountUserRequestDto = {};

    if (!data) {
        return updateData;
    }

    if (data.username !== undefined) {
        const username = normalizeUsername(data.username);
        const existingUsername = await accountRepository.findByUsernameExcludeId(username, userId);

        if (existingUsername) {
            throw new HttpException(409, "Username already exists");
        }

        updateData.username = username;
    }

    if (data.email !== undefined) {
        const email = normalizeEmail(data.email);
        const existingEmail = await accountRepository.findByEmailExcludeId(email, userId);

        if (existingEmail) {
            throw new HttpException(409, "Email already exists");
        }

        updateData.email = email;
    }

    return updateData;
};

const normalizeUserProfileUpdate = (data?: UpdateAccountUserProfileRequestDto) => {
    const updateData: UpdateAccountUserProfileRequestDto = {};

    if (!data) {
        return updateData;
    }

    if (data.firstName !== undefined) {
        updateData.firstName = normalizeString(data.firstName);
    }

    if (data.lastName !== undefined) {
        updateData.lastName = normalizeString(data.lastName);
    }

    if (data.gender !== undefined) {
        updateData.gender = data.gender;
    }

    if (data.dob !== undefined) {
        updateData.dob = normalizeOptionalDate(data.dob);
    }

    if (data.phoneNumber !== undefined) {
        updateData.phoneNumber = normalizeOptionalString(data.phoneNumber);
    }

    if (data.address !== undefined) {
        updateData.address = normalizeOptionalString(data.address);
    }

    if (data.note !== undefined) {
        updateData.note = normalizeOptionalString(data.note);
    }

    if (data.profile !== undefined) {
        updateData.profile = normalizeMinioObject(data.profile);
    }

    return updateData;
};

const hasUpdates = (data: object) => Object.keys(data).length > 0;

export const accountService = {
    async changePassword(userId: string, data: ChangePasswordRequestDto) {
        const user = await accountRepository.findUserByIdWithPassword(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const isCurrentPasswordValid = await passwordHashUtil.verify(data.currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            throw new HttpException(400, "Current password is incorrect");
        }

        const hashedPassword = await passwordHashUtil.hash(data.newPassword);
        const updatedUser = await accountRepository.updatePassword(userId, hashedPassword);

        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }

        return buildAuthUserResponse(updatedUser);
    },

    async updateAccount(userId: string, data: UpdateAccountRequestDto) {
        const user = await accountRepository.findUserById(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const userUpdate = await normalizeUserUpdate(userId, data.user);
        const userProfileUpdate = normalizeUserProfileUpdate(data.userProfile);
        const userObject = user.toObject() as unknown as PlainObject;
        let updatedUser = user;

        if (hasUpdates(userProfileUpdate)) {
            const userProfile = userObject.userProfile as PlainObject | null | undefined;
            const userProfileId = userProfile?._id;

            if (!userProfileId) {
                throw new HttpException(404, "User profile not found");
            }

            const updatedUserProfile = await accountRepository.updateUserProfile(String(userProfileId), userProfileUpdate);

            if (!updatedUserProfile) {
                throw new HttpException(404, "User profile not found");
            }
        }

        if (hasUpdates(userUpdate)) {
            const updated = await accountRepository.updateUser(userId, userUpdate);

            if (!updated) {
                throw new HttpException(404, "User not found");
            }

            updatedUser = updated;
        } else if (hasUpdates(userProfileUpdate)) {
            const refreshedUser = await accountRepository.findUserById(userId);

            if (!refreshedUser) {
                throw new HttpException(404, "User not found");
            }

            updatedUser = refreshedUser;
        }

        return buildAuthUserResponse(updatedUser);
    },

    logout() {
        return {
            message: "Logout successfully",
        };
    },
};
