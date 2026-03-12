import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PublicRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect authenticated users away from public pages (like login)
    return <Navigate to="/board" replace />;
  }

  return <Outlet />;
}
