// server/controllers/admin.controller.js
// Admin-only endpoints: manage products and view/update orders

const prisma = require("../utils/prisma");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/admin/products — list all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return sendSuccess(res, products);
  } catch (err) {
    console.error("Admin get products error:", err);
    return sendError(res);
  }
};

// POST /api/admin/products — create a new jersey
const createProduct = async (req, res) => {
  try {
    const { name, team, price, imageUrl, description, stock } = req.body;

    if (!name || !team || !price || !imageUrl || !description) {
      return sendError(res, "All fields are required.", 400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        team,
        price: parseFloat(price),
        imageUrl,
        description,
        stock: stock ? parseInt(stock) : 100,
      },
    });

    return sendSuccess(res, product, "Product created!", 201);
  } catch (err) {
    console.error("Admin create product error:", err);
    return sendError(res);
  }
};

// PUT /api/admin/products/:id — update a jersey
const updateProduct = async (req, res) => {
  try {
    const { name, team, price, imageUrl, description, stock } = req.body;
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return sendError(res, "Product not found.", 404);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name ?? existing.name,
        team: team ?? existing.team,
        price: price ? parseFloat(price) : existing.price,
        imageUrl: imageUrl ?? existing.imageUrl,
        description: description ?? existing.description,
        stock: stock ? parseInt(stock) : existing.stock,
      },
    });

    return sendSuccess(res, updated, "Product updated.");
  } catch (err) {
    console.error("Admin update product error:", err);
    return sendError(res);
  }
};

// DELETE /api/admin/products/:id — delete a jersey
const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return sendError(res, "Product not found.", 404);

    await prisma.product.delete({ where: { id: productId } });

    return sendSuccess(res, null, "Product deleted.");
  } catch (err) {
    console.error("Admin delete product error:", err);
    return sendError(res);
  }
};

// GET /api/admin/orders — view all orders with user info
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, orders);
  } catch (err) {
    console.error("Admin get orders error:", err);
    return sendError(res);
  }
};

// PUT /api/admin/orders/:id — update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = parseInt(req.params.id);

    const validStatuses = ["PENDING", "SHIPPED", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return sendError(res, "Invalid status. Use PENDING, SHIPPED, or DELIVERED.", 400);
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return sendError(res, "Order not found.", 404);

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return sendSuccess(res, updated, "Order status updated.");
  } catch (err) {
    console.error("Admin update order error:", err);
    return sendError(res);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
};
