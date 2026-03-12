import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function ProtectedRoute() {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("🛡️ ProtectedRoute check:", { 
      isAuthenticated, 
      hasToken: !!token, 
      path: location.pathname 
    });
  }, [isAuthenticated, token, location.pathname]);

  if (!isAuthenticated) {
    console.log("🚫 Not authenticated - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
