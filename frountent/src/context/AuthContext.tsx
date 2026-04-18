import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getCurrentUser } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setToken(storedToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("❌ Token validation failed:", error);
      localStorage.clear();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      const currentPath = window.location.pathname;
      const publicPaths = ['/', '/login', '/register', '/pricing'];
      
      if (!publicPaths.includes(currentPath)) {
        window.location.replace('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      localStorage.clear();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      window.location.replace('/login');
    };
    
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    // Fetch user profile after login
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      // non-critical, user will be fetched on next checkAuth
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, logout, checkAuth }}>
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
