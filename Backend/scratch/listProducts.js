import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../src/models/product.models.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log("Total products found:", products.length);
        products.forEach(p => {
            console.log(`\nProduct: "${p.title}" (_id: ${p._id})`);
            console.log("Variants count:", p.variants?.length);
            p.variants?.forEach((v, idx) => {
                console.log(`  Variant ${idx + 1}: _id: ${v._id}, stock: ${v.stock}`);
                console.log(`  Attributes:`, JSON.stringify(v.attributes));
            });
        });
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
