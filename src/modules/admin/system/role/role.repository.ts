import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateRoleRequestDto } from "./dto/create-role-request.dto";
import { UpdateRoleRequestDto } from "./dto/update-role-request.dto";
import { RoleModel } from "./role.model";

export const roleRepository = {
    create(data: CreateRoleRequestDto) {
        return RoleModel.create(data);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return RoleModel.findById(id).populate("permissions");
    },

    findByName(name: string) {
        return RoleModel.findOne({ name });
    },

    findByNameExcludeId(name: string, id: string) {
        return RoleModel.findOne({
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
            RoleModel.find(filter)
                .populate("permissions")
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            RoleModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    findSelectOptions() {
        return RoleModel.find()
            .select("_id name")
            .sort({ name: 1 })
            .lean();
    },

    update(id: string, data: UpdateRoleRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return RoleModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("permissions");
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return RoleModel.findByIdAndDelete(id).populate("permissions");
    },
};
