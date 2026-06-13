import { Router } from "express";
import { protectedRoutes } from "../middlewares/auth.middleware.js";
import { isSeller } from "../middlewares/seller.middleware.js";
import {
    checkout,
    getMyOrders,
    getSellerOrders,
    updateOrderStatus,
    cancelOrder,
    applyCoupon,
    addToWishlist,
    getWishlist,
    removeFromWishlist
} from "../controllers/order.controller.js";
import { validateCheckout } from "../validators/order.validators.js";

const orderRoutes = Router();

// Buyer routes
orderRoutes.post("/checkout/:productId/:variantId", validateCheckout, protectedRoutes, checkout);
orderRoutes.get("/my-orders", protectedRoutes, getMyOrders);
orderRoutes.patch("/cancel/:orderId", protectedRoutes, cancelOrder);

// Seller routes
orderRoutes.get("/seller-orders", protectedRoutes, isSeller, getSellerOrders);
orderRoutes.patch("/status/:orderId", protectedRoutes, isSeller, updateOrderStatus);


/**
 * @description
 * @route /api/order/apply-coupon
 * @method POST
 * @access Private (Buyer)
 */

orderRoutes.post("/apply-coupon", protectedRoutes, applyCoupon);



/**
 * @whishlist
 * @route /api/order/wishlist/:productId
 * @method POST
 * @access Private (Buyer)
*/

orderRoutes.post("/wishlist/:productId", protectedRoutes, addToWishlist);

/**
 * @description
 * @route /api/order/wishlist
 * @method GET
 * @access Private (Buyer)
*/

orderRoutes.get("/wishlist", protectedRoutes, getWishlist);

/**
 * @description
 * @route /api/order/wishlist/:productId
 * @method DELETE
 * @access Private (Buyer)
*/

orderRoutes.delete("/wishlist/:productId", protectedRoutes, removeFromWishlist);

export default orderRoutes;
