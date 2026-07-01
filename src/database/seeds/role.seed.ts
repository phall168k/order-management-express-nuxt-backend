import { Types } from "mongoose";
import { RoleModel } from "../../modules/admin/system/role/role.model";
import { permissionNames } from "./permission.seed";

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
            "user-profile.create",
            "user-profile.read",
            "user-profile.update",
            "user-profile.delete",
            "category.create",
            "category.read",
            "category.update",
            "category.delete",
            "product.create",
            "product.read",
            "product.update",
            "product.delete",
            "stock.create",
            "stock.read",
            "stock.update",
            "stock.delete",
            "stock-in.create",
            "stock-in.read",
            "stock-in.update",
            "stock-in.delete",
        ],
    },
    {
        name: "manager",
        permissions: [
            "permission.read",
            "role.read",
            "user.read",
            "user-profile.read",
            "category.read",
            "product.read",
            "stock.read",
            "stock-in.read",
        ],
    },
];

export const seedRoles = async (permissionMap: Map<string, Types.ObjectId>) => {
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
