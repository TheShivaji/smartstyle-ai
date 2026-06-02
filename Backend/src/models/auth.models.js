import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Buyer", "Seller"],
        default: "Buyer",
    },
})

const User = mongoose.model("User", userSchema);

export default User;