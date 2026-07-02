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
    "user-profile.create",
    "user-profile.read",
    "user-profile.update",
    "user-profile.delete",
    "payment-method.create",
    "payment-method.read",
    "payment-method.update",
    "payment-method.delete",
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
    "stock-adjustment.create",
    "stock-adjustment.read",
    "stock-adjustment.update",
    "stock-adjustment.delete",
    "sale.create",
    "sale.read",
    "sale.update",
    "sale.delete",
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
