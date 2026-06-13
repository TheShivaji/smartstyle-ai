import { body, param, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });
    }
    next();
}

const validateShipmentAddress = [
    body("shipmentAddress.fullName").notEmpty().withMessage("Full name is required"),
    body("shipmentAddress.mobileNo").notEmpty().withMessage("Mobile number is required"),
    body("shipmentAddress.address").notEmpty().withMessage("Address is required"),
    body("shipmentAddress.city").notEmpty().withMessage("City is required"),
    body("shipmentAddress.state").notEmpty().withMessage("State is required"),
    body("shipmentAddress.pincode").notEmpty().withMessage("Pincode is required"),
]

export const validateCheckout = [
    param("productId").notEmpty().withMessage("Product ID is required"),
    param("variantId").notEmpty().withMessage("Variant ID is required"),
    ...validateShipmentAddress,
    validateRequest,
]
