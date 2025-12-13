import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRouteUser({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  if (user.email.toLowerCase() === "adminev@gmail.com") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
