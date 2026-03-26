// server/index.js
// Main entry point — sets up Express, connects middleware, and mounts routes

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Allow requests from our frontend
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));

// Parse incoming JSON bodies
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// ── Health check ────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "JerseyVault API is running 🚀" });
});

// ── Global error handler ────────────────────────────────────
// This catches any errors passed via next(err)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
