import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import AppLayout from "./components/AppLayout";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import ProjectBoard from "./pages/projectboard";
import Dashboard from "./pages/dashboard";
import Chat from "./pages/chat";
import { PricingDemo } from "./components/ui/pricing-demo";

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#fff',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #0b7de0',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes (only for LOGGED OUT users) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Unrestricted Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<PricingDemo />} />

      {/* Protected Routes (only for LOGGED IN users) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout><ProjectBoard /></AppLayout>} path="/board" />
        <Route element={<AppLayout><Dashboard /></AppLayout>} path="/dashboard/:projectId" />
        <Route element={<AppLayout><Chat /></AppLayout>} path="/chat/:projectId" />
      </Route>

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // Debug: Log the initial path
  useEffect(() => {
    console.log("App mounted - initial path:", window.location.pathname);
    console.log("App mounted - full URL:", window.location.href);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
