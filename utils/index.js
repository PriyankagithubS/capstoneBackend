import jwt from "jsonwebtoken";
export const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // true in production
    sameSite: "None", // For cross-origin requests
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
});
