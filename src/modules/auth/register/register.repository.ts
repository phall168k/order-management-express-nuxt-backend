import { RoleModel } from "../../admin/system/role/role.model";
import { UserModel } from "../../admin/system/user/user.model";
import { UserProfileModel } from "../../admin/system/user-profile/user-profile.model";
import { CreateUserRequestDto } from "../../admin/system/user/dto/create-user-request.dto";
import { CreateUserProfileRequestDto } from "../../admin/system/user-profile/dto/create-user-profile-request.dto";

const populateUser = [
    {
        path: "roles",
        populate: {
            path: "permissions",
        },
    },
    "userProfile",
];

export const registerRepository = {
    findByUsername(username: string) {
        return UserModel.findOne({ username });
    },

    findByEmail(email: string) {
        return UserModel.findOne({ email });
    },

    findCustomerRole() {
        return RoleModel.findOne({
            name: {
                $regex: "^Customer$",
                $options: "i",
            },
        });
    },

    createUserProfile(data: CreateUserProfileRequestDto) {
        return UserProfileModel.create(data);
    },

    createUser(data: CreateUserRequestDto) {
        return UserModel.create(data);
    },

    findUserById(id: string) {
        return UserModel.findById(id).populate(populateUser);
    },

    deleteUserProfile(id: string) {
        return UserProfileModel.findByIdAndDelete(id);
    },
};
