// server/controllers/auth.controller.js
// Handles user registration and login

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");
const { sendSuccess, sendError } = require("../utils/response");

// Helper to create a JWT token for a user
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return sendError(res, "Name, email and password are required.", 400);
    }

    if (password.length < 6) {
      return sendError(res, "Password must be at least 6 characters.", 400);
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, "Please enter a valid email address.", 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendError(res, "An account with this email already exists.", 400);
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Generate a JWT token
    const token = generateToken(user);

    return sendSuccess(
      res,
      { token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } },
      "Account created successfully!",
      201
    );
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, "Registration failed. Please try again.");
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required.", 400);
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return sendError(res, "Invalid email or password.", 401);
    }

    // Compare provided password with the hashed one in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendError(res, "Invalid email or password.", 401);
    }

    const token = generateToken(user);

    return sendSuccess(
      res,
      { token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } },
      "Logged in successfully!"
    );
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, "Login failed. Please try again.");
  }
};

// GET /api/auth/me — get current logged-in user info
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
    });

    if (!user) return sendError(res, "User not found.", 404);

    return sendSuccess(res, user);
  } catch (err) {
    console.error("GetMe error:", err);
    return sendError(res);
  }
};

module.exports = { register, login, getMe };
