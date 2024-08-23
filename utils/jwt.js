import jwt from "jsonwebtoken";

export const createJWT = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
