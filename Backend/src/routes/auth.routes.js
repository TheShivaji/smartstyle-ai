import Router from "express";
import { signup, login } from "../controllers/auth.controller.js";
import { validateSignup, validateLogin } from "../validators/auth.validator.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignup, signup);
authRoutes.post("/login", validateLogin, login);

export default authRoutes;