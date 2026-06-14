import { Router } from "express";
import multer from "multer";

import { protectedRoutes } from "../middlewares/auth.middleware.js";
import { isSeller } from "../middlewares/seller.middleware.js";

import {
    createProduct,
    showAllProducts,
    getProductDetails,
    showAllProductsForBuyer,
    addVariants,
    addToCart,
    deleteCart,
    removeItemFromCart,
    getCart,
    updateCartQuantity,
} from "../controllers/product.controller.js";

import { validateAddToCart } from "../validators/cart.validators.js";

const productRoutes = Router();

/**
 * ------------------------------------------------------
 * Multer Configuration
 * ------------------------------------------------------
 * Stores uploaded images in memory before
 * sending them to ImageKit CDN.
 */
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 1024 * 1024 * 10,
    },

    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"));
        }
    },
});

/**
 * ------------------------------------------------------
 * Seller Routes
 * ------------------------------------------------------
 * protectedRoutes:
 * Allows only authenticated users.
 *
 * isSeller:
 * Allows only sellers to access these routes.
 */
productRoutes.post("/create", upload.array("images", 7), protectedRoutes, isSeller, createProduct);

productRoutes.get("/get-all-products", protectedRoutes, isSeller, showAllProducts);

productRoutes.post("/add-variants/:productId", upload.array("images", 7), protectedRoutes, isSeller, addVariants);

/**
 * ------------------------------------------------------
 * Buyer Routes
 * ------------------------------------------------------
 * protectedRoutes:
 * Allows only authenticated users.
 */
productRoutes.get("/get-all-products-buyer", protectedRoutes, showAllProductsForBuyer);

productRoutes.get("/details/:id", protectedRoutes, getProductDetails);

/**
 * ------------------------------------------------------
 * Cart Routes
 * ------------------------------------------------------
 * Allows buyers to:
 * - Add items to cart
 * - Update quantity
 * - Remove items
 * - View cart
 * - Clear cart
 */
productRoutes.post("/add-to-cart/:productId/:variantId", validateAddToCart, protectedRoutes, addToCart);

productRoutes.get("/get-cart", protectedRoutes, getCart);

productRoutes.put("/update-cart-quantity/:productId/:variantId", protectedRoutes, updateCartQuantity);

productRoutes.delete("/remove-from-cart/:productId/:variantId", protectedRoutes, removeItemFromCart);

productRoutes.delete("/delete-cart", protectedRoutes, deleteCart);

export default productRoutes;