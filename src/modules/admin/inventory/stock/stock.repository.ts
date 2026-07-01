import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateStockRequestDto } from "./dto/create-stock-request.dto";
import { UpdateStockRequestDto } from "./dto/update-stock-request.dto";
import { StockModel } from "./stock.model";

type StockCreateData = CreateStockRequestDto & {
    createdByUser: string;
};

type StockSearchFilter = {
    $or?: Array<{
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

export const stockRepository = {
    async create(data: StockCreateData) {
        const stock = await StockModel.create(data);

        return stock.populate([populateProduct, populateCreatedByUser]);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockModel.findById(id).populate([populateProduct, populateCreatedByUser]);
    },

    findByProduct(product: string) {
        return StockModel.findOne({ product });
    },

    findByProductExcludeId(product: string, id: string) {
        return StockModel.findOne({
            _id: { $ne: id },
            product,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: StockSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { note: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            StockModel.find(filter)
                .populate([populateProduct, populateCreatedByUser])
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            StockModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    update(id: string, data: UpdateStockRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate([populateProduct, populateCreatedByUser]);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return StockModel.findByIdAndDelete(id).populate([populateProduct, populateCreatedByUser]);
    },
};
