import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const generateToken = (user, res) => {
    const token = jwt.sign({
        userId: user._id
    },
        config.jwtSecret,
        { expiresIn: "7d" });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: config.env !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
}
export default generateToken;