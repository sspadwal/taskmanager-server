import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

// Import middleware
import authMiddleware from "./middleware/authMiddleware.js";

// Load environment variables from .env file
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000; // Default to 5000 if no PORT is provided

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log Mongo URI for debugging


// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes); // Authentication routes (register, login)
app.use("/api/tasks", authMiddleware, taskRoutes); // Task routes (protected by authMiddleware)

// Basic route for testing
app.get('/', (req, res) => {
    res.send("Hello, this is the server!");
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});