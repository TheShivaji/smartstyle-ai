import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(">>> Global Error Handler Caught: <<<", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;