import { Router } from "express";

import { protectedRoutes } from "../middlewares/auth.middleware.js";
import { isSeller } from "../middlewares/seller.middleware.js";

import {
  checkout,
  getMyOrders,
  cancelOrder,
  applyCoupon,
  getOrderDetails,
} from "../controllers/order.controller.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/auth.controller.js";

import { validateCheckout } from "../validators/order.validators.js";

const orderRoutes = Router();


// ======================================================
// BUYER ORDER ROUTES
// ======================================================

orderRoutes.post(
  "/checkout/:productId/:variantId",
  protectedRoutes,
  validateCheckout,
  checkout
);

orderRoutes.get(
  "/my-orders",
  protectedRoutes,
  getMyOrders
);

orderRoutes.get(
  "/order-details/:orderId",
  protectedRoutes,
  getOrderDetails
);

orderRoutes.patch(
  "/cancel/:orderId",
  protectedRoutes,
  cancelOrder
);


// ======================================================
// COUPON ROUTES
// ======================================================

orderRoutes.post(
  "/apply-coupon",
  protectedRoutes,
  applyCoupon
);


// ======================================================
// WISHLIST ROUTES
// ======================================================

orderRoutes.post(
  "/wishlist/:productId",
  protectedRoutes,
  addToWishlist
);

orderRoutes.get(
  "/wishlist",
  protectedRoutes,
  getWishlist
);

orderRoutes.delete(
  "/wishlist/:productId",
  protectedRoutes,
  removeFromWishlist
);


// ======================================================
// SELLER ORDER MANAGEMENT
// ======================================================




export default orderRoutes;