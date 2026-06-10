import { Product } from "../models/product.models.js";
import User from "../models/auth.models.js";
import {uploadFile} from "../service/storage.service.js";
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, currency } = req.body;


        const images = await Promise.all(req.files.map(file => uploadFile(
            {
                buffer: file.buffer,
                fileName: file.originalname
            }
        )));

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const product = await Product.create({
            title,
            description,
            price:{
                amount: price,
                currency: currency || "INR"
            },
            images,
            user: user._id,
        });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.log("Error in createProduct controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message,
        });
    }
}

export const showAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            user: req.user._id
        });
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.log("Error in featchAllProducts controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error featching products",
            error: error.message,
        });
    }
}
export const showAllProductsForBuyer = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.log("Error in featchAllProducts controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error featching products",
            error: error.message,
        });
    }
}
export const getProductDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.log("Error in getProductDetails controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching product details",
            error: error.message,
        });
    }
}