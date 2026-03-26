// client/src/components/ProductCard.jsx

import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-dark-700 rounded-lg overflow-hidden border border-dark-600 hover:border-brand-500 transition-all duration-200 group">

      {/* Product image */}
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden h-52 bg-dark-600">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x300?text=Jersey";
            }}
          />

          {/* Team badge */}
          <span className="absolute top-3 left-3 bg-dark-900/80 text-brand-500 text-xs px-2 py-1 rounded font-medium">
            {product.team}
          </span>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-white font-display text-lg leading-tight hover:text-brand-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          {/* ✅ INR PRICE */}
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