export const isSeller = (req, res, next) => {
    console.log(req.user);
    if (req.user.role !== "Seller") {
        return res.status(403).json({
            success: false,
            message: "Only sellers can access this route",
        });
    }

    next();
};