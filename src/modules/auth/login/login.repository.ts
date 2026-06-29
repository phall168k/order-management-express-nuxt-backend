import { UserModel } from "../../admin/system/user/user.model";

export const loginRepository = {
    findByUsernameOrEmail(usernameOrEmail: string) {
        return UserModel.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail },
            ],
        })
            .select("+password")
            .populate({
                path: "roles",
                populate: {
                    path: "permissions",
                },
            });
    },
};
