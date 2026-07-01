import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateUserProfileRequestDto } from "./dto/create-user-profile-request.dto";
import { UpdateUserProfileRequestDto } from "./dto/update-user-profile-request.dto";
import { UserProfileModel } from "./user-profile.model";
import { UserModel } from "../user/user.model";

type UserProfileSearchFilter = {
    $or?: Array<{
        code?: { $regex: string; $options: string };
        firstName?: { $regex: string; $options: string };
        lastName?: { $regex: string; $options: string };
        phoneNumber?: { $regex: string; $options: string };
        address?: { $regex: string; $options: string };
        note?: { $regex: string; $options: string };
    }>;
};

type UserProfileSelectOptionFilter = {
    _id?: { $nin: Types.ObjectId[] };
};

const populateCreatedByUser = {
    path: "createdByUser",
    select: "username email",
};

export const userProfileRepository = {
    async create(data: CreateUserProfileRequestDto) {
        const userProfile = await UserProfileModel.create(data);

        return userProfile.populate(populateCreatedByUser);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserProfileModel.findById(id).populate(populateCreatedByUser);
    },

    findByCode(code: string) {
        return UserProfileModel.findOne({ code });
    },

    findByCodeExcludeId(code: string, id: string) {
        return UserProfileModel.findOne({
            _id: { $ne: id },
            code,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: UserProfileSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { code: { $regex: query.search, $options: "i" } },
                { firstName: { $regex: query.search, $options: "i" } },
                { lastName: { $regex: query.search, $options: "i" } },
                { phoneNumber: { $regex: query.search, $options: "i" } },
                { address: { $regex: query.search, $options: "i" } },
                { note: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            UserProfileModel.find(filter)
                .populate(populateCreatedByUser)
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            UserProfileModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    async findSelectOptions(mode: "all" | "unmapped" = "all") {
        const filter: UserProfileSelectOptionFilter = {};

        if (mode === "unmapped") {
            const mappedUserProfileIds = await UserModel.distinct("userProfile", {
                userProfile: {
                    $exists: true,
                    $ne: null,
                },
            });

            filter._id = { $nin: mappedUserProfileIds };
        }

        const userProfiles = await UserProfileModel.find(filter)
            .select("_id firstName lastName")
            .sort({ firstName: 1, lastName: 1 })
            .lean();

        return userProfiles.map((userProfile) => ({
            id: userProfile._id.toString(),
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
        }));
    },

    update(id: string, data: UpdateUserProfileRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserProfileModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateCreatedByUser);
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserProfileModel.findByIdAndDelete(id).populate(populateCreatedByUser);
    },
};
