import { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/api"; // backend call
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

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

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loginWithGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        console.log("Google Code →", codeResponse);

        const data = await googleLogin(codeResponse.code);
        
        if (!data?.access_token) {
          throw new Error("Invalid server response");
        }

        login(data.access_token);
        navigate("/board");
      } catch (err) {
        console.error("Google login error:", err);
        setError("Google login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      setError("Google login failed. Please try again.");
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
    <div style={styles.container} className="container">
      {/* Desktop: Left side with quotes and animations */}
      <div style={styles.leftSide} className="left-side">
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0b7de0" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
          </div>
          <h1 style={styles.brandName}>Synq</h1>
          <p style={styles.brandTagline}>Sync your productivity, amplify your success</p>
        </div>

        <div style={styles.quoteSection}>
          <div style={styles.quoteCard} className="quote-card" key={currentQuote}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b7de0" strokeWidth="2" style={styles.quoteIcon}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
            <blockquote style={styles.quote}>
              "{quotes[currentQuote].text}"
            </blockquote>
            <cite style={styles.author}>— {quotes[currentQuote].author}</cite>
          </div>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M3 3v5h5M6 17l4-4 4 4 6-6M21 21v-5h-5"/>
              </svg>
            </div>
            <span>Track Progress</span>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span>Set Goals</span>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon} className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
              </svg>
            </div>
            <span>Stay Focused</span>
          </div>
        </div>
      </div>

      {/* Right side: Compact login card */}
      <div style={styles.rightSide} className="right-side">
        <div style={styles.loginCard} className="login-card">
          <div style={styles.header}>
            <h2 style={styles.title} className="title">Welcome back</h2>
            <p style={styles.subtitle} className="subtitle">Sign in to continue your journey</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                className="input"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0b7de0";
                  e.target.style.boxShadow = "0 0 0 3px rgba(11, 125, 224, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3a3a3a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                className="input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#0b7de0";
                  e.target.style.boxShadow = "0 0 0 3px rgba(11, 125, 224, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3a3a3a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.checkboxContainer}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.checkboxText}>Remember me</span>
              </label>
            </div>

            {error && (
              <div style={styles.errorContainer}>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            <button
              style={{
                ...styles.button,
                ...(isLoading || !email || !password ? styles.buttonDisabled : {}),
              }}
              className="button"
              onClick={handleLogin}
              disabled={isLoading || !email || !password}
              onMouseEnter={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.background = "#0a6bc2";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.background = "#0b7de0";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? <div style={styles.spinner}></div> : "Sign In"}
            </button>

            <div style={styles.divider}>
              <span style={styles.dividerText}>or</span>
            </div>

            <button style={styles.googleButton} onClick={() => loginWithGoogle()}>
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

            <div style={styles.links}>
              <a
                href="#"
                style={styles.link}
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
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }

          .quote-card {
            animation: fadeInUp 0.6s ease-out;
          }

          .feature-icon {
            animation: float 3s ease-in-out infinite;
          }

          .feature-icon:nth-child(1) { animation-delay: 0s; }
          .feature-icon:nth-child(2) { animation-delay: 1s; }
          .feature-icon:nth-child(3) { animation-delay: 2s; }

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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
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
    background: "linear-gradient(135deg, #0b7de0 0%, #1e40af 100%)",
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
    fontWeight: "800",
    color: "#ffffff",
    margin: "0 0 10px 0",
    letterSpacing: "-2px",
  },

  brandTagline: {
    fontSize: "18px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
    fontWeight: "400",
  },

  quoteSection: {
    maxWidth: "400px",
    marginBottom: "60px",
  },

  quoteCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },

  quoteIcon: {
    marginBottom: "20px",
    opacity: 0.8,
  },

  quote: {
    fontSize: "18px",
    color: "#ffffff",
    fontStyle: "italic",
    lineHeight: "1.6",
    margin: "0 0 15px 0",
  },

  author: {
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
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
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
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
    background: "#242424",
    borderRadius: "16px",
    padding: "40px 32px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#b3b3b3",
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
    color: "#ffffff",
    background: "#1a1a1a",
    border: "1px solid #3a3a3a",
    borderRadius: "8px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxSizing: "border-box",
  } as React.CSSProperties,

  checkboxContainer: {
    marginBottom: "24px",
  },

  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },

  checkbox: {
    width: "16px",
    height: "16px",
    marginRight: "8px",
    cursor: "pointer",
    accentColor: "#0b7de0",
  },

  checkboxText: {
    fontSize: "14px",
    color: "#cccccc",
    userSelect: "none",
  },

  errorContainer: {
    padding: "12px 16px",
    marginBottom: "20px",
    background: "rgba(220, 53, 69, 0.1)",
    border: "1px solid rgba(220, 53, 69, 0.3)",
    borderRadius: "8px",
  },

  errorText: {
    fontSize: "14px",
    color: "#ff6b6b",
  },

  button: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ffffff",
    background: "#0b7de0",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    marginBottom: "20px",
  } as React.CSSProperties,

  buttonDisabled: {
    background: "#2a5580",
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
    color: "#666666",
    background: "#242424",
    padding: "0 16px",
    position: "relative",
    zIndex: 1,
  },

  googleButton: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#e0e0e0",
    background: "#3a3a3a",
    border: "1px solid #4a4a4a",
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
    color: "#b3b3b3",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
};