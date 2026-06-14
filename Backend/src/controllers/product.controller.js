import { Product } from "../models/product.models.js";
import User from "../models/auth.models.js";
import {uploadFile} from "../service/storage.service.js";
import { Cart } from "../models/cart.models.js";
import { stockOfVariant } from "../../dao/cart.dao.js";

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

export const  addToCart = async (req , res) =>{
    try{
        const {productId , variantId} = req.params;
        const {quantity = 1} = req.body;
        
        
        const product = await Product.findOne({
            _id: productId,
            "variants._id": variantId
        });
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const stock = await stockOfVariant(productId , variantId);
        if (typeof stock === "object" && stock.success === false) {
            return res.status(400).json(stock);
        }

        const cart = await Cart.findOne({
            user: req.user._id
        }) || await Cart.create({
            user: req.user._id,
            items: []
        });

        const isProductInCart = cart.items.some(item => item.product.toString() === productId && item.variant.toString() === variantId);           
        
        if(isProductInCart){
            const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant.toString() === variantId)?.quantity;
            if(quantityInCart + quantity > stock){
                return res.status(400).json({
                    success: false,
                    message: `Only ${stock} left in stock and you have ${quantityInCart} in cart`,
                });
            }
            const updatedCart = await Cart.findOneAndUpdate(
                {user: req.user._id , "items.product": productId , "items.variant": variantId},
                {
                    $inc: {"items.$.quantity": quantity}
                },
                {
                    new: true
                }
            ).populate("items.product");
            return res.status(200).json({
                success: true,
                message: "Cart updated successfully",
                cart: updatedCart,
            });
        } else {
            if(quantity > stock){
                return res.status(400).json({
                    success: false,
                    message: `Only ${stock} left in stock`,
                });
            }
            const variant = product.variants.find(v => v._id.toString() === variantId);
            if(!variant){
                return res.status(404).json({
                    success: false,
                    message: "Variant not found",
                });
            }
            cart.items.push({
                product: productId,
                variant: variantId,
                quantity,
                price: variant.price
            });
            await cart.save();
            await cart.populate("items.product");
            return res.status(200).json({
                success: true,
                message: "Product added to cart successfully",
                cart,
            });
        }
    }catch(error){
        console.log("Error in addToCart controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
            error: error.message,
        });
    }
}

export const deleteCart =  async(req , res) => {
    try{
        const userId = req.user._id;
        const cart = await Cart.findOne({
            user: userId
        });
        
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        await cart.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully",
        });
        
    }catch(error){
        console.log("Error in deleteCart controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error deleting cart",
            error: error.message,
        });
    }
}

export const removeItemFromCart = async(req , res) => {
    try{
        const {productId , variantId} = req.params;
        const cart = await Cart.findOneAndUpdate(
            { 
                user: req.user._id, 
                "items.product": productId, 
                "items.variant": variantId 
            },
            {
                $pull: {
                    items: {
                        product: productId,
                        variant: variantId
                    }
                }
            },
            {
                new: true
            }
        ).populate("items.product");
        
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart,
        });
        
    }catch(error){
        console.log("Error in removeItemFromCart controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error: error.message,
        });
    }
}

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        res.status(200).json({
            success: true,
            cart: cart || { items: [] }
        });
    } catch (error) {
        console.log("Error in getCart controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const { quantity } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }
        
        const stock = await stockOfVariant(productId, variantId);
        if (typeof stock === "object" && stock.success === false) {
            return res.status(400).json(stock);
        }
        
        if (quantity > stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${stock} items left in stock`
            });
        }
        
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            {
                $set: { "items.$.quantity": quantity }
            },
            { new: true }
        ).populate("items.product");
        
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            cart
        });
    } catch (error) {
        console.log("Error in updateCartQuantity controller: ", error);
        res.status(500).json({
            success: false,
            message: "Error updating cart quantity",
            error: error.message
        });
    }
};