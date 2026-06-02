import User from "../models/auth.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import generateToken from "../utils/generateToken.js";

const signup = async (req, res) => {
    const { fullName, email, password, contactNumber, isSeller } = req.body;
    try {
        const existingUser = await User.findOne({
            $or: [
                { email },
                { fullName }
            ]
        });
        if (existingUser.email === email) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }
        if (existingUser.fullName === fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name already exists"
            });
        }
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            contactNumber,
            role: isSeller ? "Seller" : "Buyer"
        });

        generateToken(user , res);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: user.toObject()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
    }
}

export { signup };