import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateProductRequestDto } from "./dto/create-product-request.dto";
import { UpdateProductRequestDto } from "./dto/update-product-request.dto";
import { ProductModel } from "./product.model";

type ProductCreateData = CreateProductRequestDto & {
    createdByUser: string;
};

type ProductSearchFilter = {
    $or?: Array<{
        code?: { $regex: string; $options: string };
        nameEn?: { $regex: string; $options: string };
        nameKh?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

const populateCategory = {
    path: "category",
    select: "code nameEn nameKh description",
};

export const productRepository = {
    async create(data: ProductCreateData) {
        const product = await ProductModel.create(data);

        return product.populate([populateCreatedByUser, populateCategory]);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return ProductModel.findById(id).populate([populateCreatedByUser, populateCategory]);
    },

    findByCode(code: string) {
        return ProductModel.findOne({ code });
    },

    findByCodeExcludeId(code: string, id: string) {
        return ProductModel.findOne({
            _id: { $ne: id },
            code,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: ProductSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { nameEn: { $regex: query.search, $options: "i" } },
                { nameKh: { $regex: query.search, $options: "i" } },
                { description: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            ProductModel.find(filter)
                .populate([populateCreatedByUser, populateCategory])
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            ProductModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    update(id: string, data: UpdateProductRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return ProductModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate([populateCreatedByUser, populateCategory]);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return ProductModel.findByIdAndDelete(id).populate([populateCreatedByUser, populateCategory]);
    },
};
