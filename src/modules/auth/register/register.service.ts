import { randomBytes } from "crypto";
import { Types } from "mongoose";
import { HttpException } from "../../../common/exceptions/http.exception";
import { jwtUtil } from "../../../common/utils/jwt.util";
import { passwordHashUtil } from "../../../common/utils/password-hash.util";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { registerRepository } from "./register.repository";

type PlainObject = Record<string, unknown>;

const normalizeString = (value: string) => value.trim();
const normalizeUsername = (username: string) => username.trim();
const normalizeEmail = (email: string) => email.trim().toLowerCase();

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

const generateCustomerProfileCode = () => (
    `CUS-${Date.now()}-${randomBytes(3).toString("hex").toUpperCase()}`
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

export const registerService = {
    async register(data: RegisterRequestDto) {
        const username = normalizeUsername(data.username);
        const email = normalizeEmail(data.email);

        const [existingUsername, existingEmail, customerRole] = await Promise.all([
            registerRepository.findByUsername(username),
            registerRepository.findByEmail(email),
            registerRepository.findCustomerRole(),
        ]);

        if (existingUsername) {
            throw new HttpException(409, "Username already exists");
        }

        if (existingEmail) {
            throw new HttpException(409, "Email already exists");
        }

        if (!customerRole) {
            throw new HttpException(500, "Customer role not found");
        }

        const password = await passwordHashUtil.hash(data.password);
        const userProfile = await registerRepository.createUserProfile({
            code: generateCustomerProfileCode(),
            userType: "customer",
            firstName: normalizeString(data.firstName),
            lastName: normalizeString(data.lastName),
            gender: data.gender,
            dob: normalizeOptionalDate(data.dob),
            phoneNumber: normalizeOptionalString(data.phoneNumber),
            address: normalizeOptionalString(data.address),
            profile: normalizeOptionalString(data.profile),
        });

        const user = await registerRepository.createUser({
            username,
            email,
            password,
            roles: [customerRole._id.toString()],
            userProfile: userProfile._id.toString(),
            isSuperUser: false,
            isActive: true,
        }).catch(async (error) => {
            await registerRepository.deleteUserProfile(userProfile._id.toString());
            throw error;
        });
        const registeredUser = await registerRepository.findUserById(user._id.toString());

        if (!registeredUser) {
            throw new HttpException(500, "Registered user not found");
        }

        const userObject = registeredUser.toObject() as unknown as PlainObject;
        const roles = Array.isArray(userObject.roles) ? userObject.roles : [];
        const permissions = getPermissionNames(roles);
        const tokenPayload = {
            _id: getDocumentId(userObject),
            username: registeredUser.username,
            email: registeredUser.email,
            isSuperUser: registeredUser.isSuperUser,
            isActive: registeredUser.isActive,
        };
        const token = jwtUtil.generate(tokenPayload);

        return {
            token,
            user: {
                _id: tokenPayload._id,
                username: registeredUser.username,
                email: registeredUser.email,
                isActive: registeredUser.isActive,
                isSuperUser: registeredUser.isSuperUser,
                createdAt: registeredUser.createdAt,
                updatedAt: registeredUser.updatedAt,
                roles,
                userProfile: userObject.userProfile,
                permission: permissions,
            },
        };
    },
};
