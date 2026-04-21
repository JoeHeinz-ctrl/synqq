import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SidebarProvider } from './context/SidebarContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { AppLayout } from './components/layout/AppLayout';

import Landing from './pages/landing';
import Login from './pages/login';
import Register from './pages/register';
import ProjectBoard from './pages/projectboard';
import Dashboard from './pages/dashboard';
import Chat from './pages/chat';
import MyDay from './pages/myday';
import { PricingDemo } from './components/ui/pricing-demo';

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public — logged-out only */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Unrestricted */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<PricingDemo />} />

      {/* Protected — logged-in only */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <MyDay />
            </AppLayout>
          }
        />
        <Route
          path="/board"
          element={
            <AppLayout>
              <ProjectBoard />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard/:projectId"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/chat/:projectId"
          element={
            <AppLayout>
              <Chat />
            </AppLayout>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <SidebarProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SidebarProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
