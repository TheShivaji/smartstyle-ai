import { Cart } from "../models/cart.models.js";
import { Product } from "../models/product.models.js";
import { Order } from "../models/order.model.js";
import Coupon from "../models/coupon.models.js";
import User from "../models/auth.models.js";
export const checkout = async (req, res) => {
    const { productId, variantId } = req.params;
    const { shipmentAddress } = req.body;
    try {
        // 2. Fetch the cart first to get the actual quantity from the user's cart
        const cart = await Cart.findOne({
            user: req.user._id,
            "items.product": productId,
            "items.variant": variantId
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found or item not in cart",
            });
        }

        const cartItem = cart.items.find(
            (item) => item.product.toString() === productId && item.variant.toString() === variantId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        const quantity = cartItem.quantity;
        const variantPrice = cartItem.price.amount;

        // 3. Atomic check & stock reduction
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId,
                "variants._id": variantId,
                "variants.stock": { $gte: quantity } // Atomic stock check to prevent race conditions
            },
            {
                $inc: { "variants.$.stock": -quantity } // Atomic stock reduction
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(400).json({
                success: false,
                message: "Quantity exceeds available stock, or variant not found",
            });
        }

        // 4. Remove item from Cart
        await Cart.updateOne(
            { user: req.user._id },
            {
                $pull: {
                    items: {
                        product: productId,
                        variant: variantId
                    }
                }
            }
        );

        // 5. Create Order
        try {
            const order = await Order.create({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        variant: variantId,
                        quantity: quantity
                    }
                ],
                shipmentAddress,
                totalAmount: variantPrice * quantity,
            });

            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order,
            });
        } catch (orderError) {
            // ROLLBACK: If order creation fails, return the stock back to the variant
            console.error("Order creation failed, rolling back stock: ", orderError);
            await Product.updateOne(
                { _id: productId, "variants._id": variantId },
                { $inc: { "variants.$.stock": quantity } }
            );

            // Rollback: put the item back into the cart
            await Cart.updateOne(
                { user: req.user._id },
                {
                    $push: {
                        items: {
                            product: productId,
                            variant: variantId,
                            quantity: quantity,
                            price: {
                                amount: variantPrice,
                                currency: cartItem.price.currency || "INR"
                            }
                        }
                    }
                }
            );

            throw new Error(`Order placement failed: ${orderError.message}`);
        }

    } catch (error) {
        console.error("Error in checkout controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error checking out",
            error: error.message,
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("Error in getMyOrders controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // 1. Find order and verify it belongs to the logged-in buyer
        const order = await Order.findOne({ _id: orderId, user: req.user._id });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 2. Only PENDING orders can be cancelled
        if (order.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is already ${order.status}`,
            });
        }

        // 3. Update order status to CANCELLED
        order.status = "CANCELLED";
        await order.save();

        // 4. Restore stock back to the product variants
        for (const item of order.items) {
            await Product.updateOne(
                { _id: item.product, "variants._id": item.variant },
                { $inc: { "variants.$.stock": item.quantity } }
            );
        }

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order,
        });
    } catch (error) {
        console.error("Error in cancelOrder controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message,
        });
    }
}

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            coupon,
        });
    } catch (error) {
        console.error("Error in applyCoupon controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error applying coupon",
            error: error.message,
        });
    }
}

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        user.wishlist.push(productId);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Product added to wishlist successfully",
            user,
        });
    } catch (error) {
        console.error("Error in addToWishlist controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error adding product to wishlist",
            error: error.message,
        });
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        user.wishlist.pull(productId);
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            user,
        });
    } catch (error) {
        console.error("Error in removeFromWishlist controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error removing product from wishlist",
            error: error.message,
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.error("Error in getWishlist controller: ", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching wishlist",
            error: error.message,
        });
    }
};