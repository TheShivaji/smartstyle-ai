import Router from "express";
import { signup, login, getMe } from "../controllers/auth.controller.js";
import { validateSignup, validateLogin } from "../validators/auth.validator.js";
import { protectedRoutes } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignup, signup);
authRoutes.post("/login", validateLogin, login);
authRoutes.get("/me", protectedRoutes, getMe);

export default authRoutes;