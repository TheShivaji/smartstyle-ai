import mongoose from "mongoose";
import priceSchema from "./priceSchema.js";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            amount: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                enum: ["USD", "INR", "EUR", "GBP"],
                required: true
            }
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        images: [
            {
                url: {
                    type: String,
                    required: true
                },

            }
        ],
        variants: [
            {
                images: [
                    {
                        url: {
                            type: String,
                            required: true
                        }
                    }
                ],
                stock: {
                    type: Number,
                    default: 0
                },
                attributes: {
                    type: Map,
                    of: String
                },
                price: {
                    type: priceSchema,
                    required: true
                },


            }
        ]
    }
)


export const Product = mongoose.model("Product", productSchema);