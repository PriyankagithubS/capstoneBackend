import express from 'express';
import { createJWT } from './jwt'; 

const router = express.Router();

router.post('/login', (req, res) => {
    const { userId } = req.body;

    // Create JWT
    const token = createJWT(userId);

    // Send response
    res.status(200).json({
        success: true,
        token: token,
        message: "Authentication successful",
    });
});

export default router;
