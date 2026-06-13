import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    isActive : {
        type: Boolean,
        default: true,
    },
    expiresAt : {
        type: Date,
        required: true,
    },
    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
    
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;