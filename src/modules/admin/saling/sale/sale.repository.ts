import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { StockModel } from "../../inventory/stock/stock.model";
import { SaleStatus } from "./dto/create-sale-request.dto";
import { UpdateSaleRequestDto } from "./dto/update-sale-request.dto";
import { SaleModel } from "./sale.model";

type SaleCreateData = {
    code: string;
    customer: string;
    salingDate: Date;
    createdByUser: string;
    status: SaleStatus;
    paymentMethod: string;
    address: string;
    note?: string;
    items: Array<{
        product: string;
        quantity: number;
        unitPrice: number;
        discount: number;
        note?: string;
    }>;
};

type SaleSearchFilter = {
    $or?: Array<{
        code?: { $regex: string; $options: string };
        address?: { $regex: string; $options: string };
        note?: { $regex: string; $options: string };
    }>;
};

const populateCustomer = {
    path: "customer",
    select: "username email",
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

const populatePaymentMethod = {
    path: "paymentMethod",
    select: "logo bankAccount merchantName merchantCity amount currency storeLabel phoneNumber billNumber terminalLabel",
};

const populateItemsProduct = {
    path: "items.product",
    select: "code nameEn nameKh unitPrice discount thumbnail",
};

const populateSale = [
    populateCustomer,
    populateCreatedByUser,
    populatePaymentMethod,
    populateItemsProduct,
];

export const saleRepository = {
    async create(data: SaleCreateData) {
        const sale = await SaleModel.create(data);

        return sale.populate(populateSale);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return SaleModel.findById(id).populate(populateSale);
    },

    findRawById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return SaleModel.findById(id);
    },

    findByCode(code: string) {
        return SaleModel.findOne({ code });
    },

    findByCodeExcludeId(code: string, id: string) {
        return SaleModel.findOne({
            _id: { $ne: id },
            code,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: SaleSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { address: { $regex: query.search, $options: "i" } },
                { note: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            SaleModel.find(filter)
                .populate(populateSale)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            SaleModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    incrementStocks(items: Array<{ product: string; quantity: number }>) {
        return StockModel.bulkWrite(
            items.map((item) => ({
                updateOne: {
                    filter: { product: item.product },
                    update: { $inc: { stockOut: item.quantity } },
                },
            })),
        );
    },

    update(id: string, data: UpdateSaleRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return SaleModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateSale);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return SaleModel.findByIdAndDelete(id).populate(populateSale);
    },
};
