// server/controllers/product.controller.js
// Handles fetching products — with optional filters

const prisma = require("../utils/prisma");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/products
// Supports query params: team, minPrice, maxPrice
const getAllProducts = async (req, res) => {
  try {
    const { team, minPrice, maxPrice } = req.query;

    // Build filter object dynamically based on query params
    const filters = {};

    if (team) {
      filters.team = { contains: team, mode: "insensitive" }; // case-insensitive match
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    const products = await prisma.product.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, products);
  } catch (err) {
    console.error("Get products error:", err);
    return sendError(res);
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product) return sendError(res, "Product not found.", 404);

    return sendSuccess(res, product);
  } catch (err) {
    console.error("Get product error:", err);
    return sendError(res);
  }
};

module.exports = { getAllProducts, getProductById };
