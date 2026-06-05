import { Router } from "express";
import { protectedRoutes } from "../middlewares/auth.middleware.js";
import { createProduct , showAllProducts} from "../controllers/product.controller.js";
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
    }
})

productRoutes.post("/create", upload.array("images", 7), protectedRoutes, isSeller, createProduct);
productRoutes.get("/get-all-products", protectedRoutes, showAllProducts);

export default productRoutes;
