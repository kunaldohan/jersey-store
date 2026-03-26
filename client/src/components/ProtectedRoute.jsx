// client/src/components/ProtectedRoute.jsx
// Wraps routes that require the user to be logged in (or admin)

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  // Not logged in → send to login page
  if (!user) return <Navigate to="/login" replace />;

  // Trying to access admin area without admin role
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
