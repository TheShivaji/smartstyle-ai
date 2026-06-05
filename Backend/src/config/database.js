import mongoose from "mongoose";
import { config } from "./config.js";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoURI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}



export default connectDB;