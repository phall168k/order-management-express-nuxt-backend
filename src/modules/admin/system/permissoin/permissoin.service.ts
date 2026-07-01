import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { permissionRepository } from "./permission.repository";

const normalizeName = (name: string) => name.trim();

export const permissionService = {
    async create(data: CreatePermissionRequestDto) {
        const name = normalizeName(data.name);
        const existingPermission = await permissionRepository.findByName(name);

        if (existingPermission) {
            throw new HttpException(409, "Permission already exists");
        }

        return permissionRepository.create({ name });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await permissionRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const permission = await permissionRepository.findById(id);

        if (!permission) {
            throw new HttpException(404, "Permission not found");
        }

        return permission;
    },

    async findSelectOptions() {
        return permissionRepository.findSelectOptions();
    },

    async update(id: string, data: UpdatePermissionRequestDto) {
        const updateData: UpdatePermissionRequestDto = {};

        if (data.name !== undefined) {
            const name = normalizeName(data.name);
            const existingPermission = await permissionRepository.findByNameExcludeId(name, id);

            if (existingPermission) {
                throw new HttpException(409, "Permission already exists");
            }

            updateData.name = name;
        }

        const permission = await permissionRepository.update(id, updateData);

        if (!permission) {
            throw new HttpException(404, "Permission not found");
        }

        return permission;
    },

    async delete(id: string) {
        const permission = await permissionRepository.delete(id);

        if (!permission) {
            throw new HttpException(404, "Permission not found");
        }

        return permission;
    },
};
