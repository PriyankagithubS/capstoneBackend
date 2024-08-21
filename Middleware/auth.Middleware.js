import jwt from "jsonwebtoken";
import User from "../Models/user.Schema.js";

const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Check if the Authorization header contains the token
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]; // Extract the token
        }

        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const resp = await User.findById(decodedToken.userId).select(
                "isAdmin email"
            );

            req.user = {
                email: resp.email,
                isAdmin: resp.isAdmin,
                userId: decodedToken.userId,
            };

            next();
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Not authorized. Token missing." });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ status: false, message: "Not authorized. Invalid token." });
    }
};
const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "Not authorized as admin. Try logging in as admin.",
        });
    }
};

export { isAdminRoute, protectRoute };
