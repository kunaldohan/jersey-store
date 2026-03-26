// client/src/pages/ProductsPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import Alert from "../components/Alert";

const TEAMS = ["All", "Real Madrid", "Barcelona", "Manchester United", "Liverpool", "PSG", "Brazil", "Argentina", "Chelsea"];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTeam, setSelectedTeam] = useState(searchParams.get("team") || "All");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [selectedTeam, maxPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (selectedTeam && selectedTeam !== "All") params.team = selectedTeam;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await api.get("/api/products", { params });
      setProducts(res.data.data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    if (team !== "All") {
      setSearchParams({ team });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
      <div className="mb-8">
        <div className="accent-line" />
        <h1 className="text-white text-4xl font-display">ALL JERSEYS</h1>
        <p className="text-gray-400 text-sm mt-1">{products.length} products found</p>
      </div>

      {/* Filters */}
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex flex-wrap gap-2">
          {TEAMS.map((team) => (
            <button
              key={team}
              onClick={() => handleTeamSelect(team)}
              className={`text-sm px-3 py-1 rounded transition-colors ${
                selectedTeam === team || (team === "All" && selectedTeam === "All")
                  ? "bg-brand-500 text-white"
                  : "bg-dark-600 text-gray-300 hover:bg-dark-500"
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-gray-400 text-sm">Max Price:</label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-dark-600 text-white text-sm px-3 py-1 rounded border border-dark-500 focus:border-brand-500 outline-none"
          >
            <option value="">Any</option>
            <option value="75">Under $75</option>
            <option value="85">Under $85</option>
            <option value="95">Under $95</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p>No jerseys found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
