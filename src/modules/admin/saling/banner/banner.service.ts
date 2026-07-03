import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { ProductModel } from "../../master-data/product/product.model";
import { UserModel } from "../../system/user/user.model";
import { bannerRepository } from "./banner.repository";
import { CreateBannerRequestDto } from "./dto/create-banner-request.dto";
import { UpdateBannerRequestDto } from "./dto/update-banner-request.dto";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const validateCreatedByUser = async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new HttpException(400, "Invalid created by user");
    }

    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, "Created by user not found");
    }
};

const validateProduct = async (productId: string) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new HttpException(400, "Invalid product");
    }

    const product = await ProductModel.exists({ _id: productId });

    if (!product) {
        throw new HttpException(404, "Product not found");
    }
};

export const bannerService = {
    async create(data: CreateBannerRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const product = normalizeString(data.product);
        await validateProduct(product);

        return bannerRepository.create({
            product,
            title: normalizeString(data.title),
            description: normalizeOptionalString(data.description),
            thumbnail: normalizeString(data.thumbnail),
            isActive: data.isActive ?? true,
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await bannerRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const banner = await bannerRepository.findById(id);

        if (!banner) {
            throw new HttpException(404, "Banner not found");
        }

        return banner;
    },

    async findSelectOptions() {
        const banners = await bannerRepository.findSelectOptions();

        return banners.map((banner) => ({
            id: banner._id.toString(),
            product: banner.product,
            title: banner.title,
            description: banner.description,
            thumbnail: banner.thumbnail,
        }));
    },

    async update(id: string, data: UpdateBannerRequestDto) {
        const updateData: UpdateBannerRequestDto = {};

        if (data.product !== undefined) {
            const product = normalizeString(data.product);
            await validateProduct(product);
            updateData.product = product;
        }

        if (data.title !== undefined) {
            updateData.title = normalizeString(data.title);
        }

        if (data.description !== undefined) {
            updateData.description = normalizeOptionalString(data.description);
        }

        if (data.thumbnail !== undefined) {
            updateData.thumbnail = normalizeString(data.thumbnail);
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        const banner = await bannerRepository.update(id, updateData);

        if (!banner) {
            throw new HttpException(404, "Banner not found");
        }

        return banner;
    },

    async delete(id: string) {
        const banner = await bannerRepository.delete(id);

        if (!banner) {
            throw new HttpException(404, "Banner not found");
        }

        return banner;
    },
};
