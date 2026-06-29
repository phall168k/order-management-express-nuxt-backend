import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connectDatabaseForScript = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is required");
    }

    await mongoose.connect(mongoUri);
};

export const disconnectDatabaseForScript = async () => {
    await mongoose.disconnect();
};
