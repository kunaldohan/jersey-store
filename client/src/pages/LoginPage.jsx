// client/src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Please fill in all fields.");
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", form);
      const { token, user } = res.data.data;
      login(user, token);
      navigate(user.isAdmin ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 fade-in">
      <div className="bg-dark-700 border border-dark-600 rounded-lg p-8 w-full max-w-md">
        <div className="mb-6">
          <div className="accent-line" />
          <h1 className="text-white text-4xl font-display">SIGN IN</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back to JerseyVault</p>
        </div>

        {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-dark-600 border border-dark-500 focus:border-brand-500 text-white rounded px-4 py-3 outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-dark-600 border border-dark-500 focus:border-brand-500 text-white rounded px-4 py-3 outline-none transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-display text-lg py-3 rounded transition-colors uppercase tracking-wider mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Quick-fill hint for devs */}
        <div className="mt-4 p-3 bg-dark-600 rounded text-xs text-gray-500">
          <p className="font-medium text-gray-400 mb-1">Demo accounts:</p>
          <p>Admin: admin@jerseyvault.com / admin123</p>
          <p>User:  user@jerseyvault.com / user123</p>
        </div>

        <p className="text-gray-500 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-500 hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
