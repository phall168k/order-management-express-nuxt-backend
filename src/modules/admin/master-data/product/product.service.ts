import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { CategoryModel } from "../category/category.model";
import { UserModel } from "../../system/user/user.model";
import { CreateProductRequestDto } from "./dto/create-product-request.dto";
import { UpdateProductRequestDto } from "./dto/update-product-request.dto";
import { productRepository } from "./product.repository";

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

const validateCategory = async (categoryId: string) => {
    if (!Types.ObjectId.isValid(categoryId)) {
        throw new HttpException(400, "Invalid category");
    }

    const category = await CategoryModel.exists({ _id: categoryId });

    if (!category) {
        throw new HttpException(404, "Category not found");
    }
};

export const productService = {
    async create(data: CreateProductRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const code = normalizeString(data.code);
        const category = normalizeString(data.category);
        const existingProduct = await productRepository.findByCode(code);

        if (existingProduct) {
            throw new HttpException(409, "Product code already exists");
        }

        await validateCategory(category);

        return productRepository.create({
            code,
            nameEn: normalizeString(data.nameEn),
            nameKh: normalizeString(data.nameKh),
            unitPrice: data.unitPrice,
            description: normalizeOptionalString(data.description),
            thumbnail: normalizeString(data.thumbnail),
            category,
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await productRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const product = await productRepository.findById(id);

        if (!product) {
            throw new HttpException(404, "Product not found");
        }

        return product;
    },

    async findSelectOptions() {
        const products = await productRepository.findSelectOptions();

        return products.map((product) => ({
            id: product._id.toString(),
            code: product.code,
            nameEn: product.nameEn,
            nameKh: product.nameKh,
            unitPrice: product.unitPrice,
            thumbnail: product.thumbnail,
            stock: product.stock ?? null,
        }));
    },

    async update(id: string, data: UpdateProductRequestDto) {
        const updateData: UpdateProductRequestDto = {};

        if (data.code !== undefined) {
            const code = normalizeString(data.code);
            const existingProduct = await productRepository.findByCodeExcludeId(code, id);

            if (existingProduct) {
                throw new HttpException(409, "Product code already exists");
            }

            updateData.code = code;
        }

        if (data.nameEn !== undefined) {
            updateData.nameEn = normalizeString(data.nameEn);
        }

        if (data.nameKh !== undefined) {
            updateData.nameKh = normalizeString(data.nameKh);
        }

        if (data.unitPrice !== undefined) {
            updateData.unitPrice = data.unitPrice;
        }

        if (data.description !== undefined) {
            updateData.description = normalizeOptionalString(data.description);
        }

        if (data.thumbnail !== undefined) {
            updateData.thumbnail = normalizeString(data.thumbnail);
        }

        if (data.category !== undefined) {
            const category = normalizeString(data.category);
            await validateCategory(category);
            updateData.category = category;
        }

        const product = await productRepository.update(id, updateData);

        if (!product) {
            throw new HttpException(404, "Product not found");
        }

        return product;
    },

    async delete(id: string) {
        const product = await productRepository.delete(id);

        if (!product) {
            throw new HttpException(404, "Product not found");
        }

        return product;
    },
};
