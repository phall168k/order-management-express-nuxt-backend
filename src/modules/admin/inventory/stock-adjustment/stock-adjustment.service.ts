import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { ProductModel } from "../../master-data/product/product.model";
import { UserModel } from "../../system/user/user.model";
import { StockModel } from "../stock/stock.model";
import {
    CreateStockAdjustmentItemRequestDto,
    CreateStockAdjustmentRequestDto,
} from "./dto/create-stock-adjustment-request.dto";
import { UpdateStockAdjustmentRequestDto } from "./dto/update-stock-adjustment-request.dto";
import { stockAdjustmentRepository } from "./stock-adjustment.repository";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizeDate = (value: string) => new Date(value);

const getCreateItems = (data: CreateStockAdjustmentRequestDto) => (
    Array.isArray(data) ? data : data.items
);

const getCodePrefix = () => {
    const year = new Date().getFullYear().toString().slice(-2);

    return `STA${year}`;
};

const getNextCodes = async (count: number) => {
    const prefix = getCodePrefix();
    const latestStockAdjustment = await stockAdjustmentRepository.findLatestByCodePrefix(prefix);
    const latestSequence = latestStockAdjustment?.code.startsWith(prefix)
        ? Number(latestStockAdjustment.code.slice(prefix.length))
        : 0;

    return Array.from({ length: count }, (_, index) => (
        `${prefix}${String(latestSequence + index + 1).padStart(5, "0")}`
    ));
};

const validateCreatedByUser = async (userId: string) => {
    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, "Created by user not found");
    }
};

const validateProducts = async (productIds: string[]) => {
    const invalidProduct = productIds.find((productId) => !Types.ObjectId.isValid(productId));

    if (invalidProduct) {
        throw new HttpException(400, "Invalid product");
    }

    const products = await ProductModel.find({
        _id: { $in: productIds },
    }).select("_id");

    if (products.length !== new Set(productIds).size) {
        throw new HttpException(404, "Product not found");
    }
};

const validateStocks = async (productIds: string[]) => {
    const stocks = await StockModel.find({
        product: { $in: productIds },
    }).select("product");

    if (stocks.length !== new Set(productIds).size) {
        throw new HttpException(404, "Product stock not found");
    }
};

const normalizeCreateItems = (items: CreateStockAdjustmentItemRequestDto[]) => (
    items.map((item) => ({
        stockAdjustmentDate: normalizeDate(item.stockAdjustmentDate),
        product: normalizeString(item.product),
        quantity: item.quantity,
        note: normalizeOptionalString(item.note),
    }))
);

const groupQuantityByProduct = (items: Array<{ product: string; quantity: number }>) => {
    const quantityByProduct = new Map<string, number>();

    items.forEach((item) => {
        quantityByProduct.set(
            item.product,
            (quantityByProduct.get(item.product) ?? 0) + item.quantity,
        );
    });

    return Array.from(quantityByProduct.entries()).map(([product, quantity]) => ({
        product,
        quantity,
    }));
};

export const stockAdjustmentService = {
    async create(data: CreateStockAdjustmentRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const items = normalizeCreateItems(getCreateItems(data));
        const uniqueProductIds = Array.from(new Set(items.map((item) => item.product)));

        await validateProducts(uniqueProductIds);
        await validateStocks(uniqueProductIds);

        const codes = await getNextCodes(items.length);
        const stockAdjustments = await stockAdjustmentRepository.createMany(
            items.map((item, index) => ({
                ...item,
                code: codes[index],
                createdByUser,
            })),
        );

        await stockAdjustmentRepository.incrementStocks(groupQuantityByProduct(items));

        return stockAdjustments;
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await stockAdjustmentRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const stockAdjustment = await stockAdjustmentRepository.findById(id);

        if (!stockAdjustment) {
            throw new HttpException(404, "Stock adjustment not found");
        }

        return stockAdjustment;
    },

    async update(id: string, data: UpdateStockAdjustmentRequestDto) {
        const existingStockAdjustment = await stockAdjustmentRepository.findRawById(id);

        if (!existingStockAdjustment) {
            throw new HttpException(404, "Stock adjustment not found");
        }

        const updateData: UpdateStockAdjustmentRequestDto = {};
        let nextProduct = existingStockAdjustment.product.toString();
        let nextQuantity = existingStockAdjustment.quantity;

        if (data.stockAdjustmentDate !== undefined) {
            updateData.stockAdjustmentDate = normalizeDate(data.stockAdjustmentDate).toISOString();
        }

        if (data.product !== undefined) {
            const product = normalizeString(data.product);
            await validateProducts([product]);
            await validateStocks([product]);
            updateData.product = product;
            nextProduct = product;
        }

        if (data.quantity !== undefined) {
            updateData.quantity = data.quantity;
            nextQuantity = data.quantity;
        }

        if (data.note !== undefined) {
            updateData.note = normalizeOptionalString(data.note);
        }

        const stockAdjustment = await stockAdjustmentRepository.update(id, updateData);

        if (!stockAdjustment) {
            throw new HttpException(404, "Stock adjustment not found");
        }

        const previousProduct = existingStockAdjustment.product.toString();
        const previousQuantity = existingStockAdjustment.quantity;

        if (previousProduct === nextProduct) {
            const quantityDifference = nextQuantity - previousQuantity;

            if (quantityDifference !== 0) {
                await stockAdjustmentRepository.incrementStocks([
                    {
                        product: nextProduct,
                        quantity: quantityDifference,
                    },
                ]);
            }
        } else {
            await stockAdjustmentRepository.incrementStocks([
                {
                    product: previousProduct,
                    quantity: -previousQuantity,
                },
                {
                    product: nextProduct,
                    quantity: nextQuantity,
                },
            ]);
        }

        return stockAdjustment;
    },

    async delete(id: string) {
        const existingStockAdjustment = await stockAdjustmentRepository.findRawById(id);

        if (!existingStockAdjustment) {
            throw new HttpException(404, "Stock adjustment not found");
        }

        const stockAdjustment = await stockAdjustmentRepository.delete(id);

        if (!stockAdjustment) {
            throw new HttpException(404, "Stock adjustment not found");
        }

        await stockAdjustmentRepository.incrementStocks([
            {
                product: existingStockAdjustment.product.toString(),
                quantity: -existingStockAdjustment.quantity,
            },
        ]);

        return stockAdjustment;
    },
};
