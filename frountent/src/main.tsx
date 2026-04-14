import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import "./App.css";
// tailwind layers
import "./style/tailwind.css";

// CRITICAL: Early token validation before React renders
// This prevents the app from rendering with an invalid token
(async () => {
  const token = localStorage.getItem("token");
  
  if (token) {
    console.log("🔍 Early token check - validating before app render...");
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://api.dozzl.xyz"}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        console.error("❌ Early token check failed - clearing localStorage");
        localStorage.clear();
        
        // If we're on a protected route, redirect immediately
        const protectedRoutes = ['/board', '/dashboard'];
        if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
          console.log("🔄 Redirecting from protected route to login");
          window.location.replace('/login');
          return; // Don't render the app
        }
      } else {
        console.log("✅ Early token check passed");
      }
    } catch (error) {
      console.error("❌ Early token check error:", error);
      localStorage.clear();
      
      const protectedRoutes = ['/board', '/dashboard'];
      if (protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
        window.location.replace('/login');
        return;
      }
    }
  }

  // Render the app
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId="335846643539-am8i2gne8ajsu3sbgfomb61pp26dr6ir.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
})();