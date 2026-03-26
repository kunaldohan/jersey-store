// client/src/pages/CartPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      setCartItems(res.data.data);
    } catch {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put(`/api/cart/${itemId}`, { quantity: newQty });
      setCartItems(prev =>
        prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
      );
      refreshCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quantity.");
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      refreshCart();
    } catch {
      setError("Failed to remove item.");
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/orders");
      setCartItems([]);
      refreshCart();
      setSuccess("Order placed successfully! 🎉 Redirecting to your orders...");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
      <div className="mb-8">
        <div className="accent-line" />
        <h1 className="text-white text-4xl font-display">YOUR CART</h1>
      </div>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/products" className="text-brand-500 hover:underline">Browse jerseys →</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart items list */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-dark-700 border border-dark-600 rounded-lg p-4 flex gap-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=Jersey"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.product.name}</p>
                  <p className="text-gray-400 text-sm">{item.product.team}</p>
                  <p className="text-brand-500 font-bold mt-1">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <div className="flex items-center bg-dark-600 rounded border border-dark-500">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-white hover:text-brand-500 text-sm">−</button>
                    <span className="px-3 text-white text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-white hover:text-brand-500 text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-sm transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-6 h-fit sticky top-20">
            <h2 className="text-white font-display text-2xl mb-4">ORDER SUMMARY</h2>
            <div className="flex flex-col gap-3 text-sm text-gray-400 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between gap-2">
                  <span className="truncate">{item.product.name} × {item.quantity}</span>
                  <span className="text-white flex-shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dark-500 pt-3 flex justify-between mb-6">
              <span className="text-white font-semibold">Total</span>
              <span className="text-brand-500 font-display text-xl font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={placingOrder}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-display text-lg py-3 rounded transition-colors uppercase"
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
