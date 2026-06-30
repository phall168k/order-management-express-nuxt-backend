import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { PermissionModel } from "../permissoin/permission.model";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { roleRepository } from "./role.repository";

const normalizeName = (name: string) => name.trim();

const normalizePermissionIds = (permissionIds?: string[]) => {
    if (!permissionIds) {
        return undefined;
    }

    return [...new Set(permissionIds.map((permissionId) => permissionId.trim()))];
};

const validatePermissionIds = async (permissionIds?: string[]) => {
    const normalizedPermissionIds = normalizePermissionIds(permissionIds);

    if (!normalizedPermissionIds) {
        return undefined;
    }

    const hasInvalidPermissionId = normalizedPermissionIds.some(
        (permissionId) => !Types.ObjectId.isValid(permissionId),
    );

    if (hasInvalidPermissionId) {
        throw new HttpException(400, "Invalid permission id");
    }

    const permissionsCount = await PermissionModel.countDocuments({
        _id: { $in: normalizedPermissionIds },
    });

    if (permissionsCount !== normalizedPermissionIds.length) {
        throw new HttpException(404, "Permission not found");
    }

    return normalizedPermissionIds;
};

export const roleService = {
    async create(data: CreateRoleRequestDto) {
        const name = normalizeName(data.name);
        const existingRole = await roleRepository.findByName(name);

        if (existingRole) {
            throw new HttpException(409, "Role already exists");
        }

        const permissions = await validatePermissionIds(data.permissions);

        return roleRepository.create({
            name,
            permissions,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await roleRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const role = await roleRepository.findById(id);

        if (!role) {
            throw new HttpException(404, "Role not found");
        }

        return role;
    },

    async findSelectOptions() {
        const roles = await roleRepository.findSelectOptions();

        return roles.map((role) => ({
            id: role._id.toString(),
            name: role.name,
        }));
    },

    async update(id: string, data: UpdateRoleRequestDto) {
        const updateData: UpdateRoleRequestDto = {};

        if (data.name !== undefined) {
            const name = normalizeName(data.name);
            const existingRole = await roleRepository.findByNameExcludeId(name, id);

            if (existingRole) {
                throw new HttpException(409, "Role already exists");
            }

            updateData.name = name;
        }

        if (data.permissions !== undefined) {
            updateData.permissions = await validatePermissionIds(data.permissions);
        }

        const role = await roleRepository.update(id, updateData);

        if (!role) {
            throw new HttpException(404, "Role not found");
        }

        return role;
    },

    async delete(id: string) {
        const role = await roleRepository.delete(id);

        if (!role) {
            throw new HttpException(404, "Role not found");
        }

        return role;
    },
};
