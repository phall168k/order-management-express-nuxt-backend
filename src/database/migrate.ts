import {
    connectDatabaseForScript,
    disconnectDatabaseForScript,
} from "./database.util";
import { PermissionModel } from "../modules/admin/system/permissoin/permission.model";
import { RoleModel } from "../modules/admin/system/role/role.model";
import { UserModel } from "../modules/admin/system/user/user.model";

const migrate = async () => {
    try {
        await connectDatabaseForScript();

        await Promise.all([
            PermissionModel.syncIndexes(),
            RoleModel.syncIndexes(),
            UserModel.syncIndexes(),
        ]);

        console.log("Migration completed");
    } catch (error) {
        console.error("Migration failed", error);
        process.exitCode = 1;
    } finally {
        await disconnectDatabaseForScript();
    }
};

void migrate();
