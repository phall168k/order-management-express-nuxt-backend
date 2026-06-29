import { Types } from "mongoose";
import { NormalizedPagination } from "../../../../common/services/base-pagination.service";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UpdateUserRequestDto } from "./dto/update-user-request.dto";
import { UserModel } from "./user.model";

type UserSearchFilter = {
    $or?: Array<{
        username?: { $regex: string; $options: string };
        email?: { $regex: string; $options: string };
    }>;
};

export const userRepository = {
    create(data: CreateUserRequestDto) {
        return UserModel.create(data);
    },

    findById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findById(id).populate("roles");
    },

    findByUsername(username: string) {
        return UserModel.findOne({ username });
    },

    findByEmail(email: string) {
        return UserModel.findOne({ email });
    },

    findByUsernameExcludeId(username: string, id: string) {
        return UserModel.findOne({
            _id: { $ne: id },
            username,
        });
    },

    findByEmailExcludeId(email: string, id: string) {
        return UserModel.findOne({
            _id: { $ne: id },
            email,
        });
    },

    async findAll(query: NormalizedPagination) {
        const filter: UserSearchFilter = {};

        if (query.search) {
            filter.$or = [
                { username: { $regex: query.search, $options: "i" } },
                { email: { $regex: query.search, $options: "i" } },
            ];
        }

        const [data, total] = await Promise.all([
            UserModel.find(filter)
                .populate("roles")
                .sort({ createdAt: -1 })
                .skip(query.skip)
                .limit(query.limit),
            UserModel.countDocuments(filter),
        ]);

        return { data, total };
    },

    update(id: string, data: UpdateUserRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate("roles");
    },

    delete(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findByIdAndDelete(id).populate("roles");
    },
};
