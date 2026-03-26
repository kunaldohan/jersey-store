// server/middleware/auth.middleware.js
// Middleware to protect routes — checks if a valid JWT is in the request headers

const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");

// Verifies the JWT token and attaches user info to req.user
const protect = (req, res, next) => {
  // Token is sent as: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Not authorized. No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, isAdmin }
    next();
  } catch (err) {
    return sendError(res, "Not authorized. Invalid token.", 401);
  }
};

// Use this middleware on routes that require admin access
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return sendError(res, "Access denied. Admins only.", 403);
  }
  next();
};

module.exports = { protect, adminOnly };
