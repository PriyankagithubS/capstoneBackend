import jwt from "jsonwebtoken";
import User from "../Models/user.Schema.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        let token;

        // Check for token in the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Extract the token
        }

        if (!token) {
            return res.status(401).json({ status: false, message: "Not authorized, token missing" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password"); // Exclude the password field

        if (!req.user) {
            return res.status(401).json({ status: false, message: "Not authorized, user not found" });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error(error);
        return res.status(401).json({ status: false, message: "Not authorized, token invalid" });
    }
};

// Middleware to check admin privilege
export const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({ status: false, message: "Not authorized as admin" });
    }
};
