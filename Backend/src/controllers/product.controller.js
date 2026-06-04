import { Product } from "../models/product.models.js";
import User from "../models/auth.models.js";
import {uploadFile} from "../service/storage.service.js";
export const createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;


        const images = await Promise.all(req.files.map(file => uploadFile(
            {
                buffer: file.buffer,
                fileName: file.originalname
            }
        )));

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const product = await Product.create({
            title,
            description,
            price,
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

