import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/api"; // backend call
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Dark theme as default

  const navigate = useNavigate();
  const { login } = useAuth();

  // Productivity quotes for inspiration
  const quotes = [
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Your limitation—it's only your imagination.", author: "Anonymous" },
    { text: "Great things never come from comfort zones.", author: "Anonymous" },
    { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
  ];

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsLoading(true);
      try {
        console.log("🛡️ Google Code Response:", codeResponse);

        const data = await googleLogin(codeResponse.code);
        console.log("🔍 Backend Response:", data);
        
        if (!data?.access_token) {
          throw new Error("Invalid server response - no access token received");
        }

        login(data.access_token);
        navigate("/board");
      } catch (err: any) {
        console.error("❌ Google login error:", err);
        setError(err.message || "Google login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("❌ Google OAuth error:", error);
      setError("Google authentication failed. Please try again.");
    }
  });

  const handleLogin = async () => {
  setError("");
  setIsLoading(true);

  try {
    const data = await loginUser(email, password);
    
    // ✅ Safety check (VERY important)
    if (!data?.access_token) {
      throw new Error("Invalid server response");
    }

    login(data.access_token);
    navigate("/board");

  } catch (err: any) {
    setError(err.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div style={getStyles(isDarkTheme).container} className="container">
      {/* Theme Toggle */}
      <button 
        style={getStyles(isDarkTheme).themeToggle}
        onClick={() => setIsDarkTheme(!isDarkTheme)}
        className="theme-toggle"
      >
        {isDarkTheme ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Desktop: Left side with quotes and animations */}
      <div style={getStyles(isDarkTheme).leftSide} className="left-side">
        {/* Floating creative elements */}
        <div className="floating-element floating-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2">
            <polygon points="12,2 15.09,8.26 22,9 17,14 18.18,21 12,17.77 5.82,21 7,14 2,9 8.91,8.26"/>
          </svg>
        </div>
        <div className="floating-element floating-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
          </svg>
        </div>
        <div className="floating-element floating-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>

        <div style={getStyles(isDarkTheme).brandSection} className="brand-section">
          <div style={getStyles(isDarkTheme).logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
          </div>
          <h1 style={getStyles(isDarkTheme).brandName}>Dozzl</h1>
          <p style={getStyles(isDarkTheme).brandTagline}>Sync your productivity, amplify your success</p>
        </div>

        <div style={getStyles(isDarkTheme).quoteSection}>
          <div style={getStyles(isDarkTheme).quoteCard} className="quote-card" key={currentQuote}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" style={getStyles(isDarkTheme).quoteIcon}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
            <blockquote style={getStyles(isDarkTheme).quote}>
              "{quotes[currentQuote].text}"
            </blockquote>
            <cite style={getStyles(isDarkTheme).author}>— {quotes[currentQuote].author}</cite>
          </div>
        </div>

        <div style={getStyles(isDarkTheme).features}>
          <div style={getStyles(isDarkTheme).feature}>
            <div style={getStyles(isDarkTheme).featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <path d="M3 3v5h5M6 17l4-4 4 4 6-6M21 21v-5h-5"/>
              </svg>
            </div>
            <span>Track Progress</span>
          </div>
          <div style={getStyles(isDarkTheme).feature}>
            <div style={getStyles(isDarkTheme).featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span>Set Goals</span>
          </div>
          <div style={getStyles(isDarkTheme).feature}>
            <div style={getStyles(isDarkTheme).featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
              </svg>
            </div>
            <span>Stay Focused</span>
          </div>
        </div>
      </div>

      {/* Right side: Compact login card */}
      <div style={getStyles(isDarkTheme).rightSide} className="right-side">
        <div style={getStyles(isDarkTheme).loginCard} className="login-card">
          <div style={getStyles(isDarkTheme).header}>
            <h2 style={getStyles(isDarkTheme).title} className="title">Welcome back</h2>
            <p style={getStyles(isDarkTheme).subtitle} className="subtitle">Sign in to continue your journey</p>
          </div>

          <div style={getStyles(isDarkTheme).form}>
            <div style={getStyles(isDarkTheme).inputGroup}>
              <input
                style={getStyles(isDarkTheme).input}
                className="input"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0ea5e9";
                  e.target.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkTheme ? "#374151" : "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={getStyles(isDarkTheme).inputGroup}>
              <input
                style={getStyles(isDarkTheme).input}
                className="input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0ea5e9";
                  e.target.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkTheme ? "#374151" : "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <div style={getStyles(isDarkTheme).errorContainer}>
                <span style={getStyles(isDarkTheme).errorText}>{error}</span>
              </div>
            )}

            <button
              style={{
                ...getStyles(isDarkTheme).button,
                ...(isLoading || !email || !password ? getStyles(isDarkTheme).buttonDisabled : {}),
              }}
              className="button"
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              onMouseEnter={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.background = "#0284c7";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.background = "#0ea5e9";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? <div style={getStyles(isDarkTheme).spinner}></div> : "Sign In"}
            </button>

            <div style={getStyles(isDarkTheme).divider}>
              <span style={getStyles(isDarkTheme).dividerText}>or</span>
            </div>

            <button style={getStyles(isDarkTheme).googleButton} onClick={() => loginWithGoogle()}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                style={{ marginRight: "12px" }}
              >
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
              Continue with Google
            </button>

            <div style={getStyles(isDarkTheme).links}>
              <a
                href="#"
                style={getStyles(isDarkTheme).link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Don't have an account? <strong>Sign up</strong>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-8px) rotate(1deg); }
            50% { transform: translateY(-15px) rotate(0deg); }
            75% { transform: translateY(-8px) rotate(-1deg); }
          }

          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-10px) translateX(5px); }
            66% { transform: translateY(-5px) translateX(-3px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .quote-card {
            animation: fadeInUp 1s ease-out;
          }

          .feature-icon {
            animation: float 4s ease-in-out infinite;
          }

          .feature-icon:nth-child(1) { animation-delay: 0s; }
          .feature-icon:nth-child(2) { animation-delay: 1.3s; }
          .feature-icon:nth-child(3) { animation-delay: 2.6s; }

          .brand-section {
            animation: slideInLeft 0.8s ease-out;
          }

          .floating-element {
            position: absolute;
            animation: floatSlow 6s ease-in-out infinite;
          }

          .floating-1 {
            top: 10%;
            right: 10%;
            animation-delay: 0s;
          }

          .floating-2 {
            top: 60%;
            right: 5%;
            animation-delay: 2s;
          }

          .floating-3 {
            top: 30%;
            left: 5%;
            animation-delay: 4s;
          }

          .theme-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .container {
              flex-direction: column !important;
            }
            
            .left-side {
              display: none !important;
            }
            
            .right-side {
              flex: 1 !important;
              min-width: auto !important;
              padding: 16px !important;
            }
            
            .login-card {
              max-width: 100% !important;
              padding: 32px 24px !important;
              margin: 0 !important;
            }
            
            .title {
              font-size: 20px !important;
            }
            
            .subtitle {
              font-size: 13px !important;
            }
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 24px 20px !important;
            }
            
            .input {
              padding: 12px 14px !important;
              font-size: 14px !important;
            }
            
            .button {
              padding: 12px !important;
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

function getStyles(isDark: boolean): { [key: string]: React.CSSProperties } {
  return {
    themeToggle: {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 1000,
      padding: "12px",
      background: isDark ? "#374151" : "#f3f4f6",
      color: isDark ? "#ffffff" : "#1f2937",
      border: "none",
      borderRadius: "50%",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      transition: "all 0.2s ease",
    } as React.CSSProperties,

    container: {
      minHeight: "100vh",
      display: "flex",
      background: isDark 
        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)" 
        : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: "relative",
      overflow: "hidden",
    },

    // Left side - Desktop only
    leftSide: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      position: "relative",
    },

    brandSection: {
      textAlign: "center",
      marginBottom: "60px",
    },

    logo: {
      marginBottom: "20px",
    },

    brandName: {
      fontSize: "48px",
      fontWeight: "900", // More bold
      color: "#000000", // Black text for better contrast
      margin: "0 0 10px 0",
      letterSpacing: "-2px",
      textShadow: "2px 2px 4px rgba(255, 255, 255, 0.3)", // White shadow for contrast
    },

    brandTagline: {
      fontSize: "18px",
      color: "#000000", // Black text
      margin: 0,
      fontWeight: "700", // Bold
      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.3)",
    },

    quoteSection: {
      maxWidth: "400px",
      marginBottom: "60px",
    },

    quoteCard: {
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "20px",
      border: "2px solid rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    },

    quoteIcon: {
      marginBottom: "20px",
      opacity: 0.8,
    },

    quote: {
      fontSize: "18px",
      color: "#000000", // Black text
      fontStyle: "italic",
      lineHeight: "1.6",
      margin: "0 0 15px 0",
      fontWeight: "600", // Bold
    },

    author: {
      fontSize: "14px",
      color: "#374151", // Dark gray
      fontWeight: "700", // Bold
    },

    features: {
      display: "flex",
      gap: "40px",
      justifyContent: "center",
    },

    feature: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
      color: "#000000", // Black text
      fontSize: "14px",
      fontWeight: "800", // Very bold
      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)",
    },

    featureIcon: {
      fontSize: "32px",
    },

    // Right side - Login card
    rightSide: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      minWidth: "400px",
    },

    loginCard: {
      width: "100%",
      maxWidth: "380px",
      background: isDark ? "#1f2937" : "#ffffff",
      borderRadius: "16px",
      padding: "40px 32px",
      boxShadow: isDark 
        ? "0 20px 40px rgba(0, 0, 0, 0.4)" 
        : "0 20px 40px rgba(0, 0, 0, 0.1)",
      border: isDark ? "1px solid #374151" : "1px solid #e2e8f0",
    },

    header: {
      textAlign: "center",
      marginBottom: "32px",
    },

    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#0f172a",
      margin: "0 0 8px 0",
      letterSpacing: "-0.5px",
    },

    subtitle: {
      fontSize: "14px",
      color: isDark ? "#9ca3af" : "#64748b",
      margin: "0",
      fontWeight: "400",
    },

    form: {
      display: "flex",
      flexDirection: "column",
    },

    inputGroup: {
      marginBottom: "20px",
    },

    input: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "15px",
      color: isDark ? "#ffffff" : "#0f172a",
      background: isDark ? "#111827" : "#f8fafc",
      border: isDark ? "1px solid #374151" : "1px solid #cbd5e1",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      boxSizing: "border-box",
    } as React.CSSProperties,

    errorContainer: {
      padding: "12px 16px",
      marginBottom: "20px",
      background: isDark ? "rgba(220, 53, 69, 0.2)" : "#fef2f2",
      border: isDark ? "1px solid rgba(220, 53, 69, 0.4)" : "1px solid #fecaca",
      borderRadius: "8px",
    },

    errorText: {
      fontSize: "14px",
      color: "#dc2626",
    },

    button: {
      width: "100%",
      padding: "14px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#ffffff",
      background: "#0ea5e9",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      marginBottom: "20px",
    } as React.CSSProperties,

    buttonDisabled: {
      background: "#94a3b8",
      cursor: "not-allowed",
      opacity: 0.6,
    },

    spinner: {
      width: "18px",
      height: "18px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      margin: "0 auto",
    },

    divider: {
      display: "flex",
      alignItems: "center",
      margin: "20px 0",
      position: "relative",
    },

    dividerText: {
      flex: 1,
      textAlign: "center",
      fontSize: "12px",
      color: isDark ? "#6b7280" : "#94a3b8",
      background: isDark ? "#1f2937" : "#ffffff",
      padding: "0 16px",
      position: "relative",
      zIndex: 1,
    },

    googleButton: {
      width: "100%",
      padding: "12px",
      fontSize: "14px",
      fontWeight: "500",
      color: isDark ? "#e5e7eb" : "#374151",
      background: isDark ? "#374151" : "#f9fafb",
      border: isDark ? "1px solid #4b5563" : "1px solid #d1d5db",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
    } as React.CSSProperties,

    links: {
      textAlign: "center",
    },

    link: {
      fontSize: "14px",
      color: isDark ? "#9ca3af" : "#64748b",
      textDecoration: "none",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
  };
}