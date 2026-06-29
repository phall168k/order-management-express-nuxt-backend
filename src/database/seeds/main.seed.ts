import {
    connectDatabaseForScript,
    disconnectDatabaseForScript,
} from "../database.util";
import { seedCategories } from "./category.seed";
import { seedPermissions } from "./permission.seed";
import { seedRoles } from "./role.seed";
import { seedUsers } from "./user.seed";

const runSeed = async () => {
    try {
        await connectDatabaseForScript();

        const permissionMap = await seedPermissions();
        const roleMap = await seedRoles(permissionMap);
        await seedUsers(roleMap);
        await seedCategories();

        console.log("Seed data completed");
        console.log("Default password for sample users: Password@123");
    } catch (error) {
        console.error("Seed data failed", error);
        process.exitCode = 1;
    } finally {
        await disconnectDatabaseForScript();
    }
};

void runSeed();
