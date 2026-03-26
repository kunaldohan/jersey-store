// client/src/components/ProductCard.jsx

import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const API = import.meta.env.VITE_API_URL;

  // ✅ Handle both relative + full URLs
  const imageSrc = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `${API}${product.imageUrl}`;

  return (
    <div className="bg-dark-700 rounded-lg overflow-hidden border border-dark-600 hover:border-brand-500 transition-all duration-200 group flex flex-col h-full">

      {/* Product image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-56 bg-dark-600 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />

          {/* Team badge */}
          <span className="absolute top-3 left-3 bg-dark-900/80 text-brand-500 text-xs px-2 py-1 rounded font-medium">
            {product.team}
          </span>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white font-display text-lg leading-tight hover:text-brand-500 transition-colors line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 text-sm mt-1 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4">
          {/* Price */}
          <span className="text-brand-500 font-display text-xl font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-4 py-2 rounded transition-colors font-medium"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;