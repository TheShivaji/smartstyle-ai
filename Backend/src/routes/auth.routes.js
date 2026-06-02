import Router from "express";
import { validateSignup } from "../validators/auth.validators.js";
import { signup } from "../controllers/auth.controllers.js";

const authRoutes = Router();

authRoutes.post("/signup", validateSignup, signup);