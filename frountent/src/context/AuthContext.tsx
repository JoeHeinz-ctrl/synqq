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
    if (!storedToken) {
      setToken(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      await getCurrentUser();
      setToken(storedToken);
      setIsAuthenticated(true);
    } catch (error) {
      // Token is invalid or expired - clear everything
      console.log("Auth check failed, clearing session");
      localStorage.removeItem("token");
      localStorage.removeItem("greeting_variant");
      localStorage.removeItem("greeting_ts");
      setToken(null);
      setIsAuthenticated(false);
      
      // Force redirect to login if we're on a protected route
      if (window.location.pathname !== '/login' && 
          window.location.pathname !== '/register' && 
          window.location.pathname !== '/' && 
          window.location.pathname !== '/pricing') {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("greeting_variant");
      localStorage.removeItem("greeting_ts");
      setToken(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    };
    
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("greeting_variant");
    localStorage.removeItem("greeting_ts");
    
    setToken(null);
    setIsAuthenticated(false);
    
    // Force redirect to login
    window.location.href = '/login';
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
