// server/controllers/order.controller.js
// Handles placing orders and viewing order history

const prisma = require("../utils/prisma");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/orders — place an order from the current cart
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all cart items for this user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return sendError(res, "Your cart is empty.", 400);
    }

    // Calculate total price
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create the order and its items in a single transaction
    // A transaction means: if any step fails, everything is rolled back
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          // Create order items from cart items
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price, // snapshot the price at time of order
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Clear the cart after placing order
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    return sendSuccess(res, order, "Order placed successfully!", 201);
  } catch (err) {
    console.error("Place order error:", err);
    return sendError(res);
  }
};

// GET /api/orders — get all orders for the logged-in user
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return sendSuccess(res, orders);
  } catch (err) {
    console.error("Get orders error:", err);
    return sendError(res);
  }
};

// GET /api/orders/:id — get a single order (must belong to the user)
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) return sendError(res, "Order not found.", 404);

    return sendSuccess(res, order);
  } catch (err) {
    console.error("Get order error:", err);
    return sendError(res);
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };
