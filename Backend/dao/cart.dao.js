import { Cart } from "../src/models/cart.models.js";
import { Product } from "../src/models/product.models.js";

export const stockOfVariant = async (productId , variantId) => {
    try {
        const product = await Product.findById(productId);
        if(!product){
            return {
                success: false,
                message: "Product not found",
            };
        }
        const variant = product.variants.id(variantId);
        if(!variant){
            return {
                success: false,
                message: "Variant not found",
            };
        }
        return variant.stock;
    } catch (error) {
        console.log("Error in stockOfVariant dao: ", error);
        return {
            success: false,
            message: "Error fetching stock of variant",
            error: error.message,
        };
    }
}