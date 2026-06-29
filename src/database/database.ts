import mongoose from "mongoose";

export const connectDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB Connected');
    } catch (error) {
        console.log('MongoDB Connection Failed');
        process.exit(1);
    }
}