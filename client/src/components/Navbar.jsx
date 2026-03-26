// client/src/components/Navbar.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand-500 text-2xl font-display font-bold tracking-wider">
            JERSEY<span className="text-white">VAULT</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/products"
            className="text-gray-300 hover:text-brand-500 transition-colors text-sm font-medium"
          >
            Shop
          </Link>

          {user && (
            <>
              <Link
                to="/orders"
                className="text-gray-300 hover:text-brand-500 transition-colors text-sm font-medium"
              >
                My Orders
              </Link>
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-brand-500 hover:text-brand-600 text-sm font-medium"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side: cart + auth */}
        <div className="flex items-center gap-4">
          {/* Cart icon */}
          {user && !user.isAdmin && (
            <Link to="/cart" className="relative">
              <span className="text-gray-300 hover:text-brand-500 transition-colors text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth buttons */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-gray-400 text-sm">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-dark-600 hover:bg-dark-500 text-white text-sm px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-500 hover:bg-brand-600 text-white text-sm px-4 py-2 rounded transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-dark-700 border-t border-dark-600 px-4 py-4 flex flex-col gap-4">
          <Link to="/products" className="text-gray-300 hover:text-brand-500 text-sm" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
          {user && (
            <>
              <Link to="/cart" className="text-gray-300 hover:text-brand-500 text-sm" onClick={() => setMenuOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <Link to="/orders" className="text-gray-300 hover:text-brand-500 text-sm" onClick={() => setMenuOpen(false)}>
                My Orders
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="text-brand-500 text-sm" onClick={() => setMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="text-left text-red-400 text-sm">
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-brand-500 text-sm font-medium" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
