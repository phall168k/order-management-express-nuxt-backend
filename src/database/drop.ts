import mongoose from "mongoose";
import {
    connectDatabaseForScript,
    disconnectDatabaseForScript,
} from "./database.util";

const dropDatabase = async () => {
    try {
        await connectDatabaseForScript();

        const databaseName = mongoose.connection.db?.databaseName;

        if (!databaseName) {
            throw new Error("Database connection is not ready");
        }

        await mongoose.connection.dropDatabase();
        console.log(`Database dropped: ${databaseName}`);
    } catch (error) {
        console.error("Drop database failed", error);
        process.exitCode = 1;
    } finally {
        await disconnectDatabaseForScript();
    }
};

void dropDatabase();
