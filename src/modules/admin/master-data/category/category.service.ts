import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { UserModel } from "../../system/user/user.model";
import { categoryRepository } from "./category.repository";
import { CreateCategoryRequestDto } from "./dto/create-category-request.dto";
import { UpdateCategoryRequestDto } from "./dto/update-category-request.dto";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const validateCreatedByUser = async (userId: string) => {
    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, "Created by user not found");
    }
};

export const categoryService = {
    async create(data: CreateCategoryRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const code = normalizeString(data.code);
        const existingCategory = await categoryRepository.findByCode(code);

        if (existingCategory) {
            throw new HttpException(409, "Category code already exists");
        }

        return categoryRepository.create({
            code,
            nameEn: normalizeString(data.nameEn),
            nameKh: normalizeString(data.nameKh),
            icon: normalizeOptionalString(data.icon),
            description: normalizeOptionalString(data.description),
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await categoryRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new HttpException(404, "Category not found");
        }

        return category;
    },

    async findSelectOptions() {
        const categories = await categoryRepository.findSelectOptions();

        return categories.map((category) => ({
            id: category._id.toString(),
            code: category.code,
            nameEn: category.nameEn,
            nameKh: category.nameKh,
            icon: category.icon,
        }));
    },

    async update(id: string, data: UpdateCategoryRequestDto) {
        const updateData: UpdateCategoryRequestDto = {};

        if (data.code !== undefined) {
            const code = normalizeString(data.code);
            const existingCategory = await categoryRepository.findByCodeExcludeId(code, id);

            if (existingCategory) {
                throw new HttpException(409, "Category code already exists");
            }

            updateData.code = code;
        }

        if (data.nameEn !== undefined) {
            updateData.nameEn = normalizeString(data.nameEn);
        }

        if (data.nameKh !== undefined) {
            updateData.nameKh = normalizeString(data.nameKh);
        }

        if (data.description !== undefined) {
            updateData.description = normalizeOptionalString(data.description);
        }

        if (data.icon !== undefined) {
            updateData.icon = normalizeOptionalString(data.icon);
        }

        const category = await categoryRepository.update(id, updateData);

        if (!category) {
            throw new HttpException(404, "Category not found");
        }

        return category;
    },

    async delete(id: string) {
        const category = await categoryRepository.delete(id);

        if (!category) {
            throw new HttpException(404, "Category not found");
        }

        return category;
    },
};
