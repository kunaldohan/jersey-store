// server/index.js
// Main entry point — sets up Express, connects middleware, and mounts routes

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ── CORS FIX (VERY IMPORTANT 🔥) ─────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (
      origin.includes("vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());

// ── Static Images (IMPORTANT FOR PRODUCT IMAGES 🔥) ─────────
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "public/images")));

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