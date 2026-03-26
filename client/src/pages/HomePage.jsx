// client/src/pages/HomePage.jsx

import { Link } from "react-router-dom";

const HomePage = () => {
  const teams = ["Real Madrid", "Barcelona", "Manchester United", "Liverpool", "PSG", "Brazil", "Argentina", "Chelsea"];

  return (
    <div className="fade-in">

      {/* Hero Section */}
      <section className="relative bg-dark-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #f97316 0, #f97316 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-24 flex flex-col items-center text-center">
          <div className="accent-line mx-auto" />
          <h1 className="text-white text-6xl md:text-8xl font-display font-bold leading-none mt-2">
            WEAR YOUR<br />
            <span className="text-brand-500">PASSION</span>
          </h1>
          <p className="text-gray-400 text-lg mt-6 max-w-xl">
            Authentic jerseys from the world's greatest clubs. Free shipping on orders over $100.
          </p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            <Link
              to="/products"
              className="bg-brand-500 hover:bg-brand-600 text-white font-display text-lg px-8 py-3 rounded transition-colors uppercase tracking-wider"
            >
              Shop Now
            </Link>
            <Link
              to="/register"
              className="bg-transparent border border-gray-600 hover:border-brand-500 text-white font-display text-lg px-8 py-3 rounded transition-colors uppercase tracking-wider"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-500">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-brand-600 text-center">
          {[
            { label: "Jerseys", value: "50+" },
            { label: "Teams", value: "20+" },
            { label: "Happy Customers", value: "1000+" },
          ].map((stat) => (
            <div key={stat.label} className="px-4">
              <p className="text-white font-display text-2xl font-bold">{stat.value}</p>
              <p className="text-brand-100 text-xs uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by Team */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="accent-line" />
          <h2 className="text-white text-4xl font-display">BROWSE BY TEAM</h2>
          <p className="text-gray-400 text-sm mt-1">Find your club's latest kit</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {teams.map((team) => (
            <Link
              key={team}
              to={`/products?team=${encodeURIComponent(team)}`}
              className="bg-dark-700 hover:bg-dark-600 border border-dark-600 hover:border-brand-500 rounded-lg p-4 text-center transition-all group"
            >
              <p className="text-white font-display text-lg group-hover:text-brand-500 transition-colors">
                {team}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-700 border-y border-dark-600">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-white text-4xl font-display mb-4">READY TO SHOP?</h2>
          <p className="text-gray-400 mb-8">Browse our full collection of authentic jerseys</p>
          <Link
            to="/products"
            className="bg-brand-500 hover:bg-brand-600 text-white font-display text-lg px-10 py-3 rounded transition-colors uppercase tracking-wider"
          >
            View All Jerseys →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
