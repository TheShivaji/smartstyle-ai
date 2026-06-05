import jwt from "jsonwebtoken";
import User from "../models/auth.models.js";

export const protectedRoutes = async (req, res, next) => {
    console.log(">>> Entering protectedRoutes Middleware <<<");
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        console.log(">>> protectedRoutes: Auth successful, proceeding to next <<<");
        next();
    } catch (error) {
        console.error(">>> protectedRoutes: Error occurred during auth:", error.message);
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};