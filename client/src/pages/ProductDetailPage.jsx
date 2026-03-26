// client/src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data.data);
      } catch {
        setMessage({ type: "error", text: "Product not found." });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAddingToCart(true);
    setMessage({ type: "", text: "" });
    try {
      await api.post("/api/cart", { productId: product.id, quantity });
      refreshCart();
      setMessage({ type: "success", text: "Added to cart!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add to cart." });
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Spinner />;

  if (!product) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-400">
      Product not found.
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 fade-in">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-lg overflow-hidden bg-dark-700 border border-dark-600">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Jersey"; }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-brand-500 text-sm font-medium uppercase tracking-wider">{product.team}</span>
            <h1 className="text-white text-4xl font-display mt-1">{product.name}</h1>
          </div>

          <p className="text-brand-500 text-4xl font-display font-bold">${product.price.toFixed(2)}</p>
          <p className="text-gray-400 leading-relaxed">{product.description}</p>

          <p className="text-gray-500 text-sm">
            {product.stock > 0
              ? <span className="text-green-400">✓ In Stock ({product.stock} available)</span>
              : <span className="text-red-400">✗ Out of Stock</span>}
          </p>

          <div className="flex items-center gap-3">
            <label className="text-gray-400 text-sm">Qty:</label>
            <div className="flex items-center bg-dark-600 rounded border border-dark-500">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-white hover:text-brand-500 transition-colors">−</button>
              <span className="px-4 text-white font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-white hover:text-brand-500 transition-colors">+</button>
            </div>
          </div>

          {message.text && <Alert type={message.type} message={message.text} />}

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display text-lg px-6 py-3 rounded transition-colors uppercase tracking-wider"
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
