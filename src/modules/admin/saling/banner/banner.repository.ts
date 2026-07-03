import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateBannerRequestDto } from "./dto/create-banner-request.dto";
import { UpdateBannerRequestDto } from "./dto/update-banner-request.dto";
import { BannerModel } from "./banner.model";

type BannerCreateData = CreateBannerRequestDto & {
    createdByUser: string;
};

type BannerSearchFilter = {
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
    }>;
};

const populateProduct = {
    path: "product",
    select: "code nameEn nameKh unitPrice discount thumbnail",
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

const populateBanner = [
    populateProduct,
    populateCreatedByUser,
];

export const bannerRepository = {
    async create(data: BannerCreateData) {
        const banner = await BannerModel.create(data);

        return banner.populate(populateBanner);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return BannerModel.findById(id).populate(populateBanner);
    },

    async findAll(query: NormalizedPagination) {
        const filter: BannerSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: "i" } },
                { description: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            BannerModel.find(filter)
                .populate(populateBanner)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            BannerModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    findSelectOptions() {
        return BannerModel.find()
            .select("_id product title description thumbnail")
            .populate(populateProduct)
            .sort({ title: 1 })
            .lean();
    },

    update(id: string, data: UpdateBannerRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return BannerModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateBanner);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return BannerModel.findByIdAndDelete(id).populate(populateBanner);
    },
};
