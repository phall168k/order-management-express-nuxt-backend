import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { StockModel } from "../stock/stock.model";
import { CreateStockAdjustmentItemRequestDto } from "./dto/create-stock-adjustment-request.dto";
import { UpdateStockAdjustmentRequestDto } from "./dto/update-stock-adjustment-request.dto";
import { StockAdjustmentModel } from "./stock-adjustment.model";

type StockAdjustmentCreateData = Omit<CreateStockAdjustmentItemRequestDto, "stockAdjustmentDate"> & {
    code: string;
    stockAdjustmentDate: Date;
    createdByUser: string;
};

type StockAdjustmentSearchFilter = {
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

export const stockAdjustmentRepository = {
    async createMany(data: StockAdjustmentCreateData[]) {
        const stockAdjustments = await StockAdjustmentModel.insertMany(data);

        return StockAdjustmentModel.find({
            _id: { $in: stockAdjustments.map((stockAdjustment) => stockAdjustment._id) },
        })
            .populate([populateProduct, populateCreatedByUser])
            .sort({ code: 1 });
    },

    findLatestByCodePrefix(prefix: string) {
        return StockAdjustmentModel.findOne({
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

        return StockAdjustmentModel.findById(id).populate([populateProduct, populateCreatedByUser]);
    },

    findRawById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockAdjustmentModel.findById(id);
    },

    findByCode(code: string) {
        return StockAdjustmentModel.findOne({ code });
    },

    async findAll(query: NormalizedPagination) {
        const filter: StockAdjustmentSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { note: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            StockAdjustmentModel.find(filter)
                .populate([populateProduct, populateCreatedByUser])
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            StockAdjustmentModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    incrementStocks(items: Array<{ product: string; quantity: number }>) {
        return StockModel.bulkWrite(
            items.map((item) => ({
                updateOne: {
                    filter: { product: item.product },
                    update: { $inc: { stockAdjustment: item.quantity } },
                },
            })),
        );
    },

    update(id: string, data: UpdateStockAdjustmentRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockAdjustmentModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate([populateProduct, populateCreatedByUser]);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockAdjustmentModel.findByIdAndDelete(id).populate([populateProduct, populateCreatedByUser]);
    },
};
