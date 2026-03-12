import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";

import Landing from "./pages/landing";
import Login from "./pages/login";
import Register from "./pages/register";
import ProjectBoard from "./pages/projectboard";
import Dashboard from "./pages/dashboard";
import { PricingDemo } from "./components/ui/pricing-demo";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
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
            <Route path="/board" element={<ProjectBoard />} />
            <Route path="/dashboard/:projectId" element={<Dashboard />} />
          </Route>

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
