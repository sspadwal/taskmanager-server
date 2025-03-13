import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors({
    origin: 'https://taskifyzone.vercel.app' // Restrict to your Vercel frontend
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send("Hello, this is the server!");
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is listening on port ${PORT}`);
});