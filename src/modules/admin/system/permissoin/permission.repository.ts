import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreatePermissionRequestDto } from "./dto/create-permission-request.dto";
import { UpdatePermissionRequestDto } from "./dto/update-permission-request.dto";
import { PermissionModel } from "./permission.model";

export const permissionRepository = {
    create(data: CreatePermissionRequestDto) {
        return PermissionModel.create(data);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PermissionModel.findById(id);
    },

    findByName(name: string) {
        return PermissionModel.findOne({ name });
    },

    findByNameExcludeId(name: string, id: string) {
        return PermissionModel.findOne({
            _id: { $ne: id },
            name,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: { name?: string | { $regex: string; $options: string } } = {};

        if (query.search) {
            filter.name = { $regex: query.search, $options: "i" };
        }

        const [data, total] = await Promise.all([
            PermissionModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            PermissionModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    update(id: string, data: UpdatePermissionRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PermissionModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return PermissionModel.findByIdAndDelete(id);
    },
};
