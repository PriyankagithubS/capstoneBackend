import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './Database/dbConfig.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler, routeNotFound } from './Middleware/error.Middleware.js';
import userRouter from './Routers/user.Routes.js';
import taskRoutes from './Routers/task.Routes.js';

dotenv.config(); // Ensure dotenv is configured before accessing process.env

const app = express();

// Middleware setup
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // Ensure morgan is used before routes

// Routes setup
app.use("/api/user", userRouter); // Corrected to app.use
app.use("/api/task", taskRoutes); // Corrected to app.use

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ Message: "App is working fine" });
});

// Middleware for handling errors and 404 routes
app.use(routeNotFound);
app.use(errorHandler);

// Connect to database
connectDb();

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
