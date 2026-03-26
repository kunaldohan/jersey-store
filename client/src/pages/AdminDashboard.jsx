// client/src/pages/AdminDashboard.jsx
// Full admin panel: manage products + view/update orders
import { useState, useEffect } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";
import OrderStatusBadge from "../components/OrderStatusBadge";

// Default empty product form
const EMPTY_FORM = { name: "", team: "", price: "", imageUrl: "", description: "", stock: "" };

const AdminDashboard = () => {
  const [tab, setTab] = useState("products"); // "products" | "orders"
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Product form state
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load data whenever tab changes
  useEffect(() => {
    setError("");
    setSuccess("");
    if (tab === "products") fetchProducts();
    else fetchOrders();
  }, [tab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data.data);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/orders");
      setOrders(res.data.data);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      team: product.team,
      price: product.price,
      imageUrl: product.imageUrl,
      description: product.description,
      stock: product.stock,
    });
    setEditingId(product.id);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await api.put(`/api/admin/products/${editingId}`, form);
        setSuccess("Product updated successfully!");
      } else {
        await api.post("/api/admin/products", form);
        setSuccess("Product created successfully!");
      }
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this jersey?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setSuccess("Product deleted.");
    } catch {
      setError("Failed to delete product.");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}`, { status });
      // Update the order in local state without refetching
      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status } : o)
      );
      setSuccess(`Order #${orderId} status updated to ${status}.`);
    } catch {
      setError("Failed to update order status.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
        <div>
          <div className="accent-line" />
          <h1 className="text-white text-4xl font-display">ADMIN PANEL</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your store</p>
        </div>
        {/* Stats */}
        <div className="flex gap-4">
          <div className="bg-dark-700 border border-dark-600 rounded px-4 py-2 text-center">
            <p className="text-brand-500 font-display text-2xl font-bold">{products.length}</p>
            <p className="text-gray-500 text-xs">Products</p>
          </div>
          <div className="bg-dark-700 border border-dark-600 rounded px-4 py-2 text-center">
            <p className="text-brand-500 font-display text-2xl font-bold">{orders.length}</p>
            <p className="text-gray-500 text-xs">Orders</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}
      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 border-b border-dark-600">
        {["products", "orders"].map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setShowForm(false); }}
            className={`px-6 py-3 font-display text-lg uppercase transition-colors ${
              tab === t
                ? "text-brand-500 border-b-2 border-brand-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ─────────── PRODUCTS TAB ─────────── */}
      {tab === "products" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">{products.length} jerseys in store</p>
            <button
              onClick={openCreateForm}
              className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-4 py-2 rounded transition-colors font-medium"
            >
              + Add Jersey
            </button>
          </div>

          {/* Inline product form */}
          {showForm && (
            <div className="bg-dark-700 border border-brand-500/30 rounded-lg p-6 mb-6">
              <h2 className="text-white font-display text-2xl mb-4">
                {editingId ? "EDIT JERSEY" : "ADD NEW JERSEY"}
              </h2>
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Name", name: "name", placeholder: "Real Madrid Home Jersey 2024" },
                  { label: "Team", name: "team", placeholder: "Real Madrid" },
                  { label: "Price ($)", name: "price", placeholder: "89.99", type: "number", step: "0.01" },
                  { label: "Stock", name: "stock", placeholder: "50", type: "number" },
                ].map(field => (
                  <div key={field.name}>
                    <label className="text-gray-400 text-sm block mb-1">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      step={field.step}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleFormChange}
                      placeholder={field.placeholder}
                      required
                      className="w-full bg-dark-600 border border-dark-500 focus:border-brand-500 text-white rounded px-3 py-2 outline-none text-sm transition-colors"
                    />
                  </div>
                ))}

                {/* Image URL — full width */}
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm block mb-1">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleFormChange}
                    placeholder="https://images.unsplash.com/..."
                    required
                    className="w-full bg-dark-600 border border-dark-500 focus:border-brand-500 text-white rounded px-3 py-2 outline-none text-sm transition-colors"
                  />
                  {/* Live image preview */}
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="mt-2 h-20 w-auto rounded object-cover border border-dark-500"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                </div>

                {/* Description — full width */}
                <div className="md:col-span-2">
                  <label className="text-gray-400 text-sm block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Jersey description..."
                    required
                    className="w-full bg-dark-600 border border-dark-500 focus:border-brand-500 text-white rounded px-3 py-2 outline-none text-sm resize-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-sm px-6 py-2 rounded transition-colors font-medium"
                  >
                    {submitting ? "Saving..." : editingId ? "Update Jersey" : "Create Jersey"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-dark-600 hover:bg-dark-500 text-white text-sm px-6 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading ? <Spinner /> : (
            <div className="overflow-x-auto rounded-lg border border-dark-600">
              <table className="w-full text-sm">
                <thead className="bg-dark-700">
                  <tr className="text-gray-400 text-left">
                    <th className="py-3 px-4">Jersey</th>
                    <th className="py-3 px-4">Team</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr
                      key={product.id}
                      className={`border-t border-dark-700 hover:bg-dark-700 transition-colors ${i % 2 === 0 ? "bg-dark-800" : "bg-dark-750"}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded flex-shrink-0"
                            onError={e => { e.target.src = "https://via.placeholder.com/40?text=J"; }}
                          />
                          <span className="text-white max-w-[180px] truncate">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{product.team}</td>
                      <td className="py-3 px-4 text-brand-500 font-bold">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={product.stock > 10 ? "text-green-400" : "text-yellow-400"}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-blue-400 hover:text-blue-300 text-xs px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-300 text-xs px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-500">No products yet. Add one above!</div>
              )}
            </div>
          )}
        </>
      )}

      {/* ─────────── ORDERS TAB ─────────── */}
      {tab === "orders" && (
        <>
          <p className="text-gray-400 text-sm mb-4">{orders.length} total orders</p>
          {loading ? <Spinner /> : (
            <div className="overflow-x-auto rounded-lg border border-dark-600">
              <table className="w-full text-sm">
                <thead className="bg-dark-700">
                  <tr className="text-gray-400 text-left">
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr
                      key={order.id}
                      className={`border-t border-dark-700 hover:bg-dark-700 transition-colors ${i % 2 === 0 ? "bg-dark-800" : ""}`}
                    >
                      <td className="py-3 px-4 text-gray-400 font-mono">#{order.id}</td>
                      <td className="py-3 px-4">
                        <p className="text-white">{order.user.name}</p>
                        <p className="text-gray-500 text-xs">{order.user.email}</p>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="py-3 px-4 text-brand-500 font-bold">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {/* Dropdown to change status inline */}
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-dark-600 text-white text-xs px-2 py-1.5 rounded border border-dark-500 outline-none focus:border-brand-500 cursor-pointer"
                        >
                          <option value="PENDING">⏳ Pending</option>
                          <option value="SHIPPED">🚚 Shipped</option>
                          <option value="DELIVERED">✅ Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-500">No orders yet.</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
