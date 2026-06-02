import {body , validationResult} from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateSignup = [
    body("fullName")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long")
    .notEmpty().withMessage("Full name is required"),

    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("contactNumber")
    .notEmpty().withMessage("Contact number is required")
    .matches(/^\+?\d{10}$/).withMessage("Contact number must be 10 digits"),
    body('isSeller').
    isBoolean().withMessage("isSeller must be a boolean value").notEmpty().withMessage("isSeller is required"),
    
    validateRequest,

]