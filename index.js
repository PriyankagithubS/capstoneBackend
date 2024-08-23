import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './Database/dbConfig.js';
import morgan from 'morgan';
import { errorHandler, routeNotFound } from './Middleware/error.Middleware.js';
import userRouter from './Routers/user.Routes.js';
import taskRoutes from './Routers/task.Routes.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware setup
app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://projectmangertoolcapstone.netlify.app"
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight requests
app.options('*', cors());

// Middleware for parsing requests
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(morgan('dev')); // HTTP request logger

// Routes setup
app.use("/api/user", userRouter);
app.use("/api/task", taskRoutes);

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ message: "App is working fine" });
});

// Error handling middlewares
app.use(routeNotFound);
app.use(errorHandler);

// Connect to database
connectDb();

// Start server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
