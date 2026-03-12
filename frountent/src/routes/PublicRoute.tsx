import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/board" replace />;
  }

  return <Outlet />;
}
