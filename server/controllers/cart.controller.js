// server/controllers/cart.controller.js
// Handles cart operations — all cart data is stored in the database

const prisma = require("../utils/prisma");
const { sendSuccess, sendError } = require("../utils/response");

// GET /api/cart — get all cart items for the logged-in user
const getCart = async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }, // include product details
    });

    return sendSuccess(res, cartItems);
  } catch (err) {
    console.error("Get cart error:", err);
    return sendError(res);
  }
};

// POST /api/cart — add a product to cart (or increase quantity if already in cart)
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) return sendError(res, "Product ID is required.", 400);

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return sendError(res, "Product not found.", 404);

    // Check if this product is already in the user's cart
    const existingItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    let cartItem;

    if (existingItem) {
      // Already in cart → just increase the quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      });
    } else {
      // Not in cart → create a new cart item
      cartItem = await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity },
        include: { product: true },
      });
    }

    return sendSuccess(res, cartItem, "Item added to cart!", 201);
  } catch (err) {
    console.error("Add to cart error:", err);
    return sendError(res);
  }
};

// PUT /api/cart/:id — update quantity of a cart item
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = parseInt(req.params.id);

    if (!quantity || quantity < 1) {
      return sendError(res, "Quantity must be at least 1.", 400);
    }

    // Make sure this cart item belongs to the logged-in user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: req.user.id },
    });

    if (!cartItem) return sendError(res, "Cart item not found.", 404);

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: { product: true },
    });

    return sendSuccess(res, updated, "Cart updated.");
  } catch (err) {
    console.error("Update cart error:", err);
    return sendError(res);
  }
};

// DELETE /api/cart/:id — remove a specific item from cart
const removeFromCart = async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);

    // Ensure the item belongs to this user
    const cartItem = await prisma.cartItem.findFirst({
      where: { id: cartItemId, userId: req.user.id },
    });

    if (!cartItem) return sendError(res, "Cart item not found.", 404);

    await prisma.cartItem.delete({ where: { id: cartItemId } });

    return sendSuccess(res, null, "Item removed from cart.");
  } catch (err) {
    console.error("Remove from cart error:", err);
    return sendError(res);
  }
};

// DELETE /api/cart — clear all cart items for user
const clearCart = async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    return sendSuccess(res, null, "Cart cleared.");
  } catch (err) {
    console.error("Clear cart error:", err);
    return sendError(res);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
