import mongoose from "mongoose";

const  orderSchema = new mongoose.Schema({
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
                required: true
            }
        }
    ],
    shipmentAddress: {
        fullName: String,
        mobileNo: String,
        email: String,
        pincode: String,
        address: String,
        landmark: String,
        city: String,
        state: String,
        country: String,
    },
    status: {
        type: String,
        enum: ["PENDING", "SHIPPED" , "OUT_FOR_DELIVERY" , "DELIVERED", "CANCELLED"],
        default: "PENDING"
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

export const Order = mongoose.model("Order", orderSchema);