import { Router } from "express";
import { protectedRoutes } from "../middlewares/auth.middleware.js";
import {
    createProduct,
    showAllProducts,
    getProductDetails,
    showAllProductsForBuyer,
    addVariants
} from "../controllers/product.controller.js";
import { isSeller } from "../middlewares/seller.middleware.js";

import multer from "multer";

const productRoutes = Router();

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
 @These routes are for sellers only 
 @protectedRoutes allows only authenticated users to access these routes
 @isSeller allows only sellers to access these routes
 */
productRoutes.post(
    "/create",
    upload.array("images", 7),
    protectedRoutes,
    isSeller,
    createProduct,
);
productRoutes.get(
    "/get-all-products",
    protectedRoutes,
    isSeller,
    showAllProducts,
);
productRoutes.post("/add-variants/:productId",upload.array("images", 7), protectedRoutes, isSeller, addVariants);

/**
 @These routes are for buyers only 
 @protectedRoutes allows only authenticated users to access these routes
 */
productRoutes.get(
    "/get-all-products-buyer",
    protectedRoutes,
    showAllProductsForBuyer,
);
productRoutes.get("/details/:id", protectedRoutes, getProductDetails);

export default productRoutes;
