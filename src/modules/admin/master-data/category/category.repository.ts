import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";
import { CategoryModel } from "./category.model";

type CategoryCreateData = CreateCategoryRequestDto & {
    createdByUser: string;
};

type CategorySearchFilter = {
    $or?: Array<{
        code?: { $regex: string; $options: string };
        nameEn?: { $regex: string; $options: string };
        nameKh?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
        icon?: { $regex: string; $options: string };
    }>;
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

export const categoryRepository = {
    create(data: CategoryCreateData) {
        return CategoryModel.create(data);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return CategoryModel.findById(id).populate(populateCreatedByUser);
    },

    findByCode(code: string) {
        return CategoryModel.findOne({ code });
    },

    findByCodeExcludeId(code: string, id: string) {
        return CategoryModel.findOne({
            _id: { $ne: id },
            code,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: CategorySearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { nameEn: { $regex: query.search, $options: "i" } },
                { nameKh: { $regex: query.search, $options: "i" } },
                { icon: { $regex: query.search, $options: "i" } },
                { description: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            CategoryModel.find(filter)
                .populate(populateCreatedByUser)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            CategoryModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    findSelectOptions() {
        return CategoryModel.find()
            .select("_id code nameEn nameKh icon")
            .sort({ code: 1 })
            .lean();
    },

    update(id: string, data: UpdateCategoryRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return CategoryModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateCreatedByUser);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return CategoryModel.findByIdAndDelete(id).populate(populateCreatedByUser);
    },
};
