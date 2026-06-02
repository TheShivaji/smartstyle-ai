import dotenv from "dotenv";
dotenv.config();

if(!process.env.PORT || !process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("Missing environment variables");
}
export const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
}