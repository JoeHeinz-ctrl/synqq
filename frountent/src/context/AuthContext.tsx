import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCurrentUser } from "../services/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    
    console.log("🔍 Checking auth - token exists:", !!storedToken);
    
    if (!storedToken) {
      console.log("❌ No token found");
      setToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      console.log("🔄 Validating token with backend...");
      await getCurrentUser();
      console.log("✅ Token valid - user authenticated");
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Token validation failed:", error);
      
      // CRITICAL: Clear ALL auth data immediately
      localStorage.clear(); // Clear everything to be safe
      setToken(null);
      setIsAuthenticated(false);
      
      // Force hard redirect to login for ANY page except public pages
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register', '/pricing'];
      
      if (!publicPaths.includes(currentPath)) {
        console.log("🔄 Forcing redirect to login from:", currentPath);
        window.location.replace('/login'); // Use replace to prevent back button issues
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 AuthProvider mounted");
    checkAuth();

    const handleUnauthorized = () => {
      console.error("🚨 Unauthorized event received - clearing session");
      localStorage.clear();
      setToken(null);
      setIsAuthenticated(false);
      window.location.replace('/login');
    };
    
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      console.log("🔌 AuthProvider unmounting");
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    console.log("👋 Logging out");
    localStorage.clear();
    setToken(null);
    setIsAuthenticated(false);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
