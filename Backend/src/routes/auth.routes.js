import Router from "express";
import { signup, login, getMe, logout } from "../controllers/auth.controller.js";
import { validateSignup, validateLogin } from "../validators/auth.validator.js";
import { protectedRoutes } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignup, signup);
authRoutes.post("/login", validateLogin, login);
authRoutes.post("/logout", logout);
authRoutes.get("/me", protectedRoutes, getMe);

export default authRoutes;