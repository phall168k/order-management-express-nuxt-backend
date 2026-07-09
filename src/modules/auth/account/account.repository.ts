import { Types } from "mongoose";
import { UserModel } from "../../admin/system/user/user.model";
import { UserProfileModel } from "../../admin/system/user-profile/user-profile.model";
import { UpdateAccountUserRequestDto, UpdateAccountUserProfileRequestDto } from "./dto/update-account-request.dto";

const populateUser = [
    {
        path: "roles",
        populate: {
            path: "permissions",
        },
    },
    "userProfile",
];

export const accountRepository = {
    findUserById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findById(id).populate(populateUser);
    },

    findUserByIdWithPassword(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findById(id).select("+password");
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

    updatePassword(id: string, password: string) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findByIdAndUpdate(
            id,
            { password },
            { new: true, runValidators: true },
        ).populate(populateUser);
    },

    updateUser(id: string, data: UpdateAccountUserRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).populate(populateUser);
    },

    updateUserProfile(id: string, data: UpdateAccountUserProfileRequestDto) {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }

        return UserProfileModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    },
};
