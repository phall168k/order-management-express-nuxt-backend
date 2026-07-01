import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { ProductModel } from "../../master-data/product/product.model";
import { UserModel } from "../../system/user/user.model";
import { CreateStockRequestDto } from "./dto/create-stock-request.dto";
import { UpdateStockRequestDto } from "./dto/update-stock-request.dto";
import { stockRepository } from "./stock.repository";

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

const validateProduct = async (productId: string) => {
    if (!Types.ObjectId.isValid(productId)) {
        throw new HttpException(400, "Invalid product");
    }

    const product = await ProductModel.exists({ _id: productId });

    if (!product) {
        throw new HttpException(404, "Product not found");
    }
};

export const stockService = {
    async create(data: CreateStockRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const product = normalizeString(data.product);

        await validateProduct(product);

        const existingStock = await stockRepository.findByProduct(product);

        if (existingStock) {
            throw new HttpException(409, "Product stock already exists");
        }

        return stockRepository.create({
            product,
            minStock: data.minStock,
            stockIn: data.stockIn,
            stockOut: data.stockOut,
            stockAdjustment: data.stockAdjustment,
            isStock: data.isStock ?? true,
            note: normalizeOptionalString(data.note),
            createdByUser,
        });
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await stockRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const stock = await stockRepository.findById(id);

        if (!stock) {
            throw new HttpException(404, "Stock not found");
        }

        return stock;
    },

    async update(id: string, data: UpdateStockRequestDto) {
        const updateData: UpdateStockRequestDto = {};

        if (data.product !== undefined) {
            const product = normalizeString(data.product);
            await validateProduct(product);

            const existingStock = await stockRepository.findByProductExcludeId(product, id);

            if (existingStock) {
                throw new HttpException(409, "Product stock already exists");
            }

            updateData.product = product;
        }

        if (data.minStock !== undefined) {
            updateData.minStock = data.minStock;
        }

        if (data.stockIn !== undefined) {
            updateData.stockIn = data.stockIn;
        }

        if (data.stockOut !== undefined) {
            updateData.stockOut = data.stockOut;
        }

        if (data.stockAdjustment !== undefined) {
            updateData.stockAdjustment = data.stockAdjustment;
        }

        if (data.isStock !== undefined) {
            updateData.isStock = data.isStock;
        }

        if (data.note !== undefined) {
            updateData.note = normalizeOptionalString(data.note);
        }

        const stock = await stockRepository.update(id, updateData);

        if (!stock) {
            throw new HttpException(404, "Stock not found");
        }

        return stock;
    },

    async delete(id: string) {
        const stock = await stockRepository.delete(id);

        if (!stock) {
            throw new HttpException(404, "Stock not found");
        }

        return stock;
    },
};
