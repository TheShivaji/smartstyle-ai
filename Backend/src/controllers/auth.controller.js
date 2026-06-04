import User from "../models/auth.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
    const { fullName, email, password, contactNumber, isSeller } = req.body;
    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { fullName }],
        });
        if (existingUser.email === email) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        if (existingUser.fullName === fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name already exists",
            });
        }
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            contactNumber,
            role: isSeller ? "Seller" : "Buyer",
        });

        generateToken(user, res);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: user.toObject(),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        generateToken(existingUser, res);
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: existingUser.toObject(),
        });
    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error logging in user",
            error: error.message,
        });
    }
};
