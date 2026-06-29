import { Types } from "mongoose";
import { PermissionModel } from "../../modules/admin/system/permissoin/permission.model";

export const permissionNames = [
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

export const seedPermissions = async () => {
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
