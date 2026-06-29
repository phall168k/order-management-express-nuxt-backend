import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { passwordHashUtil } from "../../../../common/utils/password-hash.util";
import { RoleModel } from "../role/role.model";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { userRepository } from "./user.repository";

const normalizeUsername = (username: string) => username.trim();
const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizeRoleIds = (roleIds?: string[]) => {
    if (!roleIds) {
        return undefined;
    }

    return [...new Set(roleIds.map((roleId) => roleId.trim()))];
};

const validateRoleIds = async (roleIds?: string[]) => {
    const normalizedRoleIds = normalizeRoleIds(roleIds);

    if (!normalizedRoleIds) {
        return undefined;
    }

    const hasInvalidRoleId = normalizedRoleIds.some(
        (roleId) => !Types.ObjectId.isValid(roleId),
    );

    if (hasInvalidRoleId) {
        throw new HttpException(400, "Invalid role id");
    }

    const rolesCount = await RoleModel.countDocuments({
        _id: { $in: normalizedRoleIds },
    });

    if (rolesCount !== normalizedRoleIds.length) {
        throw new HttpException(404, "Role not found");
    }

    return normalizedRoleIds;
};

export const userService = {
    async create(data: CreateUserRequestDto) {
        const username = normalizeUsername(data.username);
        const email = normalizeEmail(data.email);

        const [existingUsername, existingEmail, roles] = await Promise.all([
            userRepository.findByUsername(username),
            userRepository.findByEmail(email),
            validateRoleIds(data.roles),
        ]);

        if (existingUsername) {
            throw new HttpException(409, "Username already exists");
        }

        if (existingEmail) {
            throw new HttpException(409, "Email already exists");
        }

        const password = await passwordHashUtil.hash(data.password);

        return userRepository.create({
            username,
            email,
            password,
            roles,
            isSuperUser: data.isSuperUser ?? false,
            isActive: data.isActive ?? true,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await userRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const user = await userRepository.findById(id);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        return user;
    },

    async update(id: string, data: UpdateUserRequestDto) {
        const updateData: UpdateUserRequestDto = {};

        if (data.username !== undefined) {
            const username = normalizeUsername(data.username);
            const existingUsername = await userRepository.findByUsernameExcludeId(username, id);

            if (existingUsername) {
                throw new HttpException(409, "Username already exists");
            }

            updateData.username = username;
        }

        if (data.email !== undefined) {
            const email = normalizeEmail(data.email);
            const existingEmail = await userRepository.findByEmailExcludeId(email, id);

            if (existingEmail) {
                throw new HttpException(409, "Email already exists");
            }

            updateData.email = email;
        }

        if (data.password !== undefined) {
            updateData.password = await passwordHashUtil.hash(data.password);
        }

        if (data.roles !== undefined) {
            updateData.roles = await validateRoleIds(data.roles);
        }

        if (data.isSuperUser !== undefined) {
            updateData.isSuperUser = data.isSuperUser;
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        const user = await userRepository.update(id, updateData);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        return user;
    },

    async delete(id: string) {
        const user = await userRepository.delete(id);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        return user;
    },
};
