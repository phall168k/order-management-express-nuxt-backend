import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { ProductModel } from "../../master-data/product/product.model";
import { UserModel } from "../../system/user/user.model";
import { StockModel } from "../stock/stock.model";
import {
    CreateStockInItemRequestDto,
    CreateStockInRequestDto,
} from "./dto/create-stock-in-request.dto";
import { UpdateStockInRequestDto } from "./dto/update-stock-in-request.dto";
import { stockInRepository } from "./stock-in.repository";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizeDate = (value: string) => new Date(value);

const getCreateItems = (data: CreateStockInRequestDto) => (
    Array.isArray(data) ? data : data.items
);

const getCodePrefix = () => {
    const year = new Date().getFullYear().toString().slice(-2);

    return `ST${year}`;
};

const getNextCodes = async (count: number) => {
    const prefix = getCodePrefix();
    const latestStockIn = await stockInRepository.findLatestByCodePrefix(prefix);
    const latestSequence = latestStockIn?.code.startsWith(prefix)
        ? Number(latestStockIn.code.slice(prefix.length))
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

const normalizeCreateItems = (items: CreateStockInItemRequestDto[]) => (
    items.map((item) => ({
        stockInDate: normalizeDate(item.stockInDate),
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

export const stockInService = {
    async create(data: CreateStockInRequestDto, createdByUser: string) {
        await validateCreatedByUser(createdByUser);

        const items = normalizeCreateItems(getCreateItems(data));
        const uniqueProductIds = Array.from(new Set(items.map((item) => item.product)));

        await validateProducts(uniqueProductIds);
        await validateStocks(uniqueProductIds);

        const codes = await getNextCodes(items.length);
        const stockIns = await stockInRepository.createMany(
            items.map((item, index) => ({
                ...item,
                code: codes[index],
                createdByUser,
            })),
        );

        await stockInRepository.incrementStocks(groupQuantityByProduct(items));

        return stockIns;
    },

    async findAll(query: PaginationQueryDto) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await stockInRepository.findAll(pagination);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const stockIn = await stockInRepository.findById(id);

        if (!stockIn) {
            throw new HttpException(404, "Stock in not found");
        }

        return stockIn;
    },

    async update(id: string, data: UpdateStockInRequestDto) {
        const existingStockIn = await stockInRepository.findRawById(id);

        if (!existingStockIn) {
            throw new HttpException(404, "Stock in not found");
        }

        const updateData: UpdateStockInRequestDto = {};
        let nextProduct = existingStockIn.product.toString();
        let nextQuantity = existingStockIn.quantity;

        if (data.stockInDate !== undefined) {
            updateData.stockInDate = normalizeDate(data.stockInDate).toISOString();
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

        const stockIn = await stockInRepository.update(id, updateData);

        if (!stockIn) {
            throw new HttpException(404, "Stock in not found");
        }

        const previousProduct = existingStockIn.product.toString();
        const previousQuantity = existingStockIn.quantity;

        if (previousProduct === nextProduct) {
            const quantityDifference = nextQuantity - previousQuantity;

            if (quantityDifference !== 0) {
                await stockInRepository.incrementStocks([
                    {
                        product: nextProduct,
                        quantity: quantityDifference,
                    },
                ]);
            }
        } else {
            await stockInRepository.incrementStocks([
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

        return stockIn;
    },

    async delete(id: string) {
        const existingStockIn = await stockInRepository.findRawById(id);

        if (!existingStockIn) {
            throw new HttpException(404, "Stock in not found");
        }

        const stockIn = await stockInRepository.delete(id);

        if (!stockIn) {
            throw new HttpException(404, "Stock in not found");
        }

        await stockInRepository.incrementStocks([
            {
                product: existingStockIn.product.toString(),
                quantity: -existingStockIn.quantity,
            },
        ]);

        return stockIn;
    },
};
