import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.header('Authorization');
    console.log("Auth Header:", authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or invalid format. Use Bearer <token>' });
    }

    const authToken = authHeader.split(' ')[1];
    if (!authToken) {
        return res.status(401).json({ message: 'Token is empty' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debug log to inspect payload

        // Check if userId exists in the decoded payload (flexible key handling)
        const userId = decoded.userId || decoded.id || decoded._id;
        if (!userId) {
            return res.status(401).json({ message: 'Token payload does not contain a valid user ID' });
        }

        // Attach userId to request
        req.userId = userId;
        console.log("Set req.userId:", req.userId); // Debug log

        next();
    } catch (err) {
        console.error("Token verification failed:", err.message); // Include specific error message
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;