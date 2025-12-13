import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRouteAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  if (user.email.toLowerCase() !== "adminev@gmail.com") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
