import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { StockModel } from "../stock/stock.model";
import { CreateStockInItemRequestDto } from "./dto/create-stock-in-request.dto";
import { UpdateStockInRequestDto } from "./dto/update-stock-in-request.dto";
import { StockInModel } from "./stock-in.model";

type StockInCreateData = Omit<CreateStockInItemRequestDto, "stockInDate"> & {
    code: string;
    stockInDate: Date;
    createdByUser: string;
};

type StockInSearchFilter = {
    $or?: Array<{
        code?: { $regex: string; $options: string };
        note?: { $regex: string; $options: string };
    }>;
};

const populateProduct = {
    path: "product",
    select: "code nameEn nameKh unitPrice thumbnail",
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

export const stockInRepository = {
    async createMany(data: StockInCreateData[]) {
        const stockIns = await StockInModel.insertMany(data);

        return StockInModel.find({
            _id: { $in: stockIns.map((stockIn) => stockIn._id) },
        })
            .populate([populateProduct, populateCreatedByUser])
            .sort({ code: 1 });
    },

    findLatestByCodePrefix(prefix: string) {
        return StockInModel.findOne({
            code: { $regex: `^${prefix}` },
        })
            .select("code")
            .sort({ code: -1 })
            .lean();
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockInModel.findById(id).populate([populateProduct, populateCreatedByUser]);
    },

    findRawById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockInModel.findById(id);
    },

    findByCode(code: string) {
        return StockInModel.findOne({ code });
    },

    async findAll(query: NormalizedPagination) {
        const filter: StockInSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { note: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            StockInModel.find(filter)
                .populate([populateProduct, populateCreatedByUser])
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            StockInModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    incrementStocks(items: Array<{ product: string; quantity: number }>) {
        return StockModel.bulkWrite(
            items.map((item) => ({
                updateOne: {
                    filter: { product: item.product },
                    update: { $inc: { stockIn: item.quantity } },
                },
            })),
        );
    },

    update(id: string, data: UpdateStockInRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockInModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate([populateProduct, populateCreatedByUser]);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockInModel.findByIdAndDelete(id).populate([populateProduct, populateCreatedByUser]);
    },
};
