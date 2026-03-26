// client/src/components/Footer.jsx

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">

          {/* Brand */}
          <div>
            <span className="text-brand-500 text-xl font-display font-bold tracking-wider">
              JERSEY<span className="text-white">VAULT</span>
            </span>
            <p className="text-gray-500 text-sm mt-2 max-w-xs">
              Your go-to destination for authentic football jerseys from clubs worldwide.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Shop</p>
              <div className="flex flex-col gap-2">
                <Link to="/products" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">All Jerseys</Link>
                <Link to="/products?team=Real Madrid" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">Real Madrid</Link>
                <Link to="/products?team=Barcelona" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">Barcelona</Link>
              </div>
            </div>
            <div>
              <p className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Account</p>
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">Login</Link>
                <Link to="/register" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">Register</Link>
                <Link to="/orders" className="text-gray-400 hover:text-brand-500 text-sm transition-colors">My Orders</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-600 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} JerseyVault. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with React + Node.js + PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
