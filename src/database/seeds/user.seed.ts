import { Types } from "mongoose";
import { passwordHashUtil } from "../../common/utils/password-hash.util";
import { UserModel } from "../../modules/admin/system/user/user.model";

const userSeeds = [
    {
        username: "superadmin",
        email: "superadmin@example.com",
        password: "Password@123",
        roles: ["super-admin"],
        isSuperUser: true,
        isActive: true,
    },
    {
        username: "admin",
        email: "admin@example.com",
        password: "Password@123",
        roles: ["admin"],
        isSuperUser: false,
        isActive: true,
    },
    {
        username: "manager",
        email: "manager@example.com",
        password: "Password@123",
        roles: ["manager"],
        isSuperUser: false,
        isActive: true,
    },
];

export const seedUsers = async (roleMap: Map<string, Types.ObjectId>) => {
    await Promise.all(
        userSeeds.map(async (user) => {
            const roles = user.roles
                .map((roleName) => roleMap.get(roleName))
                .filter((roleId): roleId is Types.ObjectId => Boolean(roleId));
            const password = await passwordHashUtil.hash(user.password);

            return UserModel.updateOne(
                { email: user.email },
                {
                    $set: {
                        username: user.username,
                        email: user.email,
                        roles,
                        isSuperUser: user.isSuperUser,
                        isActive: user.isActive,
                    },
                    $setOnInsert: {
                        password,
                    },
                },
                { upsert: true },
            );
        }),
    );
};
