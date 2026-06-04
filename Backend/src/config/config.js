import dotenv from "dotenv";
dotenv.config();

if(!process.env.PORT ) {
    throw new Error("PORT is not defined in .env file");
}

if(!process.env.MONGO_URI ) {
    throw new Error("MONGO_URI is not defined in .env file");
}

if(!process.env.JWT_SECRET ) {
    throw new Error("JWT_SECRET is not defined in .env file");
}

if(!process.env.IMAGEKIT_PRIVATE_KEY ) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined in .env file");
}

export const config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY,
}