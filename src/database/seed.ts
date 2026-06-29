import dotenv from "dotenv";
import mongoose, { Types } from "mongoose";
import { passwordHashUtil } from "../common/utils/password-hash.util";
import { PermissionModel } from "../modules/admin/system/permissoin/permission.model";
import { RoleModel } from "../modules/admin/system/role/role.model";
import { UserModel } from "../modules/admin/system/user/user.model";

dotenv.config();

const permissionNames = [
    "permission.create",
    "permission.read",
    "permission.update",
    "permission.delete",
    "role.create",
    "role.read",
    "role.update",
    "role.delete",
    "user.create",
    "user.read",
    "user.update",
    "user.delete",
];

const roleSeeds = [
    {
        name: "super-admin",
        permissions: permissionNames,
    },
    {
        name: "admin",
        permissions: [
            "permission.read",
            "role.read",
            "user.create",
            "user.read",
            "user.update",
        ],
    },
    {
        name: "manager",
        permissions: [
            "permission.read",
            "role.read",
            "user.read",
        ],
    },
];

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

const connect = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is required to run seed data");
    }

    await mongoose.connect(mongoUri);
};

const seedPermissions = async () => {
    await Promise.all(
        permissionNames.map((name) => (
            PermissionModel.updateOne(
                { name },
                { $set: { name } },
                { upsert: true },
            )
        )),
    );

    const permissions = await PermissionModel.find({
        name: { $in: permissionNames },
    });

    return new Map(
        permissions.map((permission) => [
            permission.name,
            permission._id as Types.ObjectId,
        ]),
    );
};

const seedRoles = async (permissionMap: Map<string, Types.ObjectId>) => {
    await Promise.all(
        roleSeeds.map((role) => {
            const permissions = role.permissions
                .map((permissionName) => permissionMap.get(permissionName))
                .filter((permissionId): permissionId is Types.ObjectId => Boolean(permissionId));

            return RoleModel.updateOne(
                { name: role.name },
                {
                    $set: {
                        name: role.name,
                        permissions,
                    },
                },
                { upsert: true },
            );
        }),
    );

    const roles = await RoleModel.find({
        name: { $in: roleSeeds.map((role) => role.name) },
    });

    return new Map(
        roles.map((role) => [
            role.name,
            role._id as Types.ObjectId,
        ]),
    );
};

const seedUsers = async (roleMap: Map<string, Types.ObjectId>) => {
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

const runSeed = async () => {
    try {
        await connect();

        const permissionMap = await seedPermissions();
        const roleMap = await seedRoles(permissionMap);
        await seedUsers(roleMap);

        console.log("Seed data completed");
        console.log("Default password for sample users: Password@123");
    } catch (error) {
        console.error("Seed data failed", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

void runSeed();
