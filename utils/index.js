import jwt from "jsonwebtoken";

export const createJWT = (res, userId) => {
    // Generate the JWT
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Send the token in the response body
    res.status(200).json({
        success: true,
        token: token,
        message: "Authentication successful",
    });
};
