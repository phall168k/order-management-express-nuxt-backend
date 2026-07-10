import { Types } from "mongoose";
import { HttpException } from "../../../../common/exceptions/http.exception";
import { BasePaginationService, PaginationQueryDto } from "../../../../common/services/base-pagination.service";
import { StockModel } from "../../inventory/stock/stock.model";
import { ProductModel } from "../../master-data/product/product.model";
import { PaymentMethodModel } from "../../system/payment-method/payment-method.model";
import { UserModel } from "../../system/user/user.model";
import {
    CreateSaleItemRequestDto,
    CreateSaleRequestDto,
} from "./dto/create-sale-request.dto";
import { UpdateSaleRequestDto } from "./dto/update-sale-request.dto";
import { saleRepository } from "./sale.repository";

const normalizeString = (value: string) => value.trim();

const normalizeOptionalString = (value?: string) => {
    if (value === undefined) {
        return undefined;
    }

    const normalized = value.trim();

    return normalized || undefined;
};

const normalizeDate = (value: string) => new Date(value);

const getCodePrefix = () => {
    const year = new Date().getFullYear().toString().slice(-2);

    return `SAL${year}`;
};

const getNextCode = async () => {
    const prefix = getCodePrefix();
    const latestSale = await saleRepository.findLatestByCodePrefix(prefix);
    const latestSequence = latestSale?.code.startsWith(prefix)
        ? Number(latestSale.code.slice(prefix.length))
        : 0;

    return `${prefix}${String(latestSequence + 1).padStart(5, "0")}`;
};

const validateUser = async (userId: string, message: string) => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new HttpException(400, `Invalid ${message.toLowerCase()}`);
    }

    const user = await UserModel.exists({ _id: userId });

    if (!user) {
        throw new HttpException(404, `${message} not found`);
    }
};

const validatePaymentMethod = async (paymentMethodId: string) => {
    if (!Types.ObjectId.isValid(paymentMethodId)) {
        throw new HttpException(400, "Invalid payment method");
    }

    const paymentMethod = await PaymentMethodModel.exists({ _id: paymentMethodId });

    if (!paymentMethod) {
        throw new HttpException(404, "Payment method not found");
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

const normalizeItems = (items: CreateSaleItemRequestDto[]) => (
    items.map((item) => ({
        product: normalizeString(item.product),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        note: normalizeOptionalString(item.note),
    }))
);

const validateItemProducts = async (items: CreateSaleItemRequestDto[]) => {
    const productIds = Array.from(new Set(items.map((item) => normalizeString(item.product))));

    await validateProducts(productIds);
    await validateStocks(productIds);
};

const groupQuantityByProduct = (items: Array<{ product: string; quantity: number }>) => {
    const quantityByProduct = new Map<string, number>();

    items.forEach((item) => {
        quantityByProduct.set(
            item.product,
            (quantityByProduct.get(item.product) ?? 0) + item.quantity,
        );
    });

    return Array.from(quantityByProduct.entries())
        .filter(([, quantity]) => quantity !== 0)
        .map(([product, quantity]) => ({
            product,
            quantity,
        }));
};

const getStockOutDifferences = (
    previousItems: Array<{ product: Types.ObjectId | string; quantity: number }>,
    nextItems: Array<{ product: string; quantity: number }>,
) => groupQuantityByProduct([
    ...previousItems.map((item) => ({
        product: item.product.toString(),
        quantity: -item.quantity,
    })),
    ...nextItems,
]);

export const saleService = {
    async create(data: CreateSaleRequestDto, createdByUser: string) {
        await validateUser(createdByUser, "Created by user");

        const customer = normalizeString(data.customer);
        const paymentMethod = normalizeString(data.paymentMethod);

        await validateUser(customer, "Customer");
        await validatePaymentMethod(paymentMethod);
        await validateItemProducts(data.items);
        const items = normalizeItems(data.items);
        const code = await getNextCode();

        const sale = await saleRepository.create({
            code,
            customer,
            salingDate: normalizeDate(data.salingDate),
            createdByUser,
            status: data.status,
            paymentMethod,
            address: normalizeString(data.address),
            note: normalizeOptionalString(data.note),
            items,
        });

        await saleRepository.incrementStocks(groupQuantityByProduct(items));

        return sale;
    },

    async findAll(query: PaginationQueryDto, createdByUser: string) {
        const pagination = BasePaginationService.normalize(query);
        const { data, total } = await saleRepository.findAll(pagination, createdByUser);

        return BasePaginationService.paginate(data, total, pagination);
    },

    async findById(id: string) {
        const sale = await saleRepository.findById(id);

        if (!sale) {
            throw new HttpException(404, "Sale not found");
        }

        return sale;
    },

    async update(id: string, data: UpdateSaleRequestDto) {
        const updateData: UpdateSaleRequestDto = {};
        const existingSale = data.items !== undefined
            ? await saleRepository.findRawById(id)
            : null;

        if (data.items !== undefined && !existingSale) {
            throw new HttpException(404, "Sale not found");
        }

        if (data.code !== undefined) {
            const code = normalizeString(data.code);
            const existingSale = await saleRepository.findByCodeExcludeId(code, id);

            if (existingSale) {
                throw new HttpException(409, "Sale code already exists");
            }

            updateData.code = code;
        }

        if (data.customer !== undefined) {
            const customer = normalizeString(data.customer);
            await validateUser(customer, "Customer");
            updateData.customer = customer;
        }

        if (data.salingDate !== undefined) {
            updateData.salingDate = normalizeDate(data.salingDate).toISOString();
        }

        if (data.status !== undefined) {
            updateData.status = data.status;
        }

        if (data.paymentMethod !== undefined) {
            const paymentMethod = normalizeString(data.paymentMethod);
            await validatePaymentMethod(paymentMethod);
            updateData.paymentMethod = paymentMethod;
        }

        if (data.address !== undefined) {
            updateData.address = normalizeString(data.address);
        }

        if (data.note !== undefined) {
            updateData.note = normalizeOptionalString(data.note);
        }

        if (data.items !== undefined) {
            await validateItemProducts(data.items);
            updateData.items = normalizeItems(data.items);
        }

        const sale = await saleRepository.update(id, updateData);

        if (!sale) {
            throw new HttpException(404, "Sale not found");
        }

        if (existingSale && updateData.items) {
            const differences = getStockOutDifferences(existingSale.items, updateData.items);

            if (differences.length > 0) {
                await saleRepository.incrementStocks(differences);
            }
        }

        return sale;
    },

    async delete(id: string) {
        const existingSale = await saleRepository.findRawById(id);

        if (!existingSale) {
            throw new HttpException(404, "Sale not found");
        }

        const sale = await saleRepository.delete(id);

        if (!sale) {
            throw new HttpException(404, "Sale not found");
        }

        await saleRepository.incrementStocks(
            groupQuantityByProduct(
                existingSale.items.map((item) => ({
                    product: item.product.toString(),
                    quantity: -item.quantity,
                })),
            ),
        );

        return sale;
    },
};
