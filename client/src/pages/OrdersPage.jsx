// client/src/pages/OrdersPage.jsx
import { useState, useEffect } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import OrderStatusBadge from "../components/OrderStatusBadge";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders");
        setOrders(res.data.data);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 fade-in">
      <div className="mb-8">
        <div className="accent-line" />
        <h1 className="text-white text-4xl font-display">MY ORDERS</h1>
      </div>

      {error && <Alert type="error" message={error} />}

      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">📦</p>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-dark-700 border border-dark-600 rounded-lg p-6">
              {/* Order header */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-4 pb-4 border-b border-dark-600">
                <div>
                  <p className="text-white font-medium">Order #{order.id}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-brand-500 font-display text-xl font-bold">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order items */}
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/48?text=J"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-gray-400 text-sm flex-shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
