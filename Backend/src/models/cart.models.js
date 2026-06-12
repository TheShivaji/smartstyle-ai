import mongoose from "mongoose";
import priceSchema from "./priceSchema.js";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            variant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product.variants"
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: priceSchema,
                required: true
            }
        }
    ]
})

export const Cart = mongoose.model("Cart", cartSchema);