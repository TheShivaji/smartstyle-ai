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
export const addVariants = async (req , res) => {
    try{
        const {productId} = req.params;
        const product = await Product.findOne({
            _id: productId,
            user: req.user._id
        })
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const files = req.files;
        let variantImages = [];

        if(files && files.length !== 0){
            (await Promise.all(files.map(async (file) => {
                const images = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
                return images
                
            }))).map(images => variantImages.push(images))
        }

        const price = req.body.priceAmount
        const stock = req.body.stock
        const attributes = JSON.parse(req.body.attributes || '{}');

        product.variants.push({
            images: variantImages,
            price: {
                amount: Number(price)|| product.price.amount,
                currency: product.price.currency,
            },
            stock: stock,
            attributes: attributes,
        })
        await product.save();

        res.status(200).json({
            success: true,
            message: "Variant added successfully",
            product,
        });

        console.log("variantImages", variantImages)
        console.log("product", product)
        console.log("req", req.user)
        
        

        
    }catch(error){
        console.log("Error in addVariants controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error adding variants",
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