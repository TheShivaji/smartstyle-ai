export const isSeller = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user found on request",
        });
    }
    if (req.user.role !== "Seller") {
        return res.status(403).json({
            success: false,
            message: "Only sellers can access this route",
        }); 
    }
    
    next();
};