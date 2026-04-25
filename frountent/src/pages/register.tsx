import { useState, useEffect } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Dark theme as default

  const navigate = useNavigate();

  // Productivity tips for new users
  const tips = [
    { text: "Start small, think big. Every great journey begins with a single step." },
    { text: "Consistency beats perfection. Small daily actions create lasting results." },
    { text: "Break big goals into smaller tasks. Progress is progress, no matter how small." },
    { text: "Celebrate your wins. Acknowledging progress fuels motivation." },
    { text: "Focus on one thing at a time. Multitasking is the enemy of deep work." },
    { text: "Your future self will thank you for the habits you build today." },
    { text: "Productivity isn't about being busy. It's about being effective." },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now." }
  ];

  // Rotate tips every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    try {
      await registerUser(name, email, password);
      navigate("/login"); // return to login
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRegister();
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

      {/* Desktop: Left side with tips and animations */}
      <div style={getStyles(isDarkTheme).leftSide} className="left-side">
        {/* Floating creative elements */}
        <div className="floating-element floating-1">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.77l-6.18 2.98L7 14.87 2 9l6.91-0.74L12 2z"/>
          </svg>
        </div>
        <div className="floating-element floating-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        </div>
        <div className="floating-element floating-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2">
            <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4l3 3h3V8h-3l-3 3z"/>
            <path d="M22 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
          </svg>
        </div>

        <div style={getStyles(isDarkTheme).brandSection}>
          <div style={getStyles(isDarkTheme).logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
          </div>
          <h1 style={getStyles(isDarkTheme).brandName}>Join Dozzl</h1>
          <p style={getStyles(isDarkTheme).brandTagline}>Start your productivity journey today</p>
        </div>

        <div style={getStyles(isDarkTheme).tipSection}>
          <div style={getStyles(isDarkTheme).tipCard} className="tip-card" key={currentTip}>
            <div style={getStyles(isDarkTheme).tipIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4l3 3h3V8h-3l-3 3z"/>
                <path d="M22 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
              </svg>
            </div>
            <p style={getStyles(isDarkTheme).tip}>
              {tips[currentTip].text}
            </p>
          </div>
        </div>

        <div style={getStyles(isDarkTheme).benefits}>
          <div style={getStyles(isDarkTheme).benefit}>
            <div style={getStyles(isDarkTheme).benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <span>Free Forever</span>
          </div>
          <div style={getStyles(isDarkTheme).benefit}>
            <div style={getStyles(isDarkTheme).benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <span>Secure & Private</span>
          </div>
          <div style={getStyles(isDarkTheme).benefit}>
            <div style={getStyles(isDarkTheme).benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span>Instant Setup</span>
          </div>
        </div>

        <div style={getStyles(isDarkTheme).stats}>
          <div style={getStyles(isDarkTheme).stat}>
            <div style={getStyles(isDarkTheme).statNumber}>10K+</div>
            <div style={getStyles(isDarkTheme).statLabel}>Happy Users</div>
          </div>
          <div style={getStyles(isDarkTheme).stat}>
            <div style={getStyles(isDarkTheme).statNumber}>50K+</div>
            <div style={getStyles(isDarkTheme).statLabel}>Tasks Completed</div>
          </div>
          <div style={getStyles(isDarkTheme).stat}>
            <div style={getStyles(isDarkTheme).statNumber}>99%</div>
            <div style={getStyles(isDarkTheme).statLabel}>Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right side: Compact register card */}
      <div style={getStyles(isDarkTheme).rightSide} className="right-side">
        <div style={getStyles(isDarkTheme).registerCard} className="register-card">
          <div style={getStyles(isDarkTheme).header}>
            <h2 style={getStyles(isDarkTheme).title} className="title">Create Account</h2>
            <p style={getStyles(isDarkTheme).subtitle} className="subtitle">Join thousands of productive users</p>
          </div>

          <div style={getStyles(isDarkTheme).form}>
            <div style={getStyles(isDarkTheme).inputGroup}>
              <input
                style={getStyles(isDarkTheme).input}
                className="input"
                placeholder="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#059669";
                  e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkTheme ? "#404040" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

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
                  e.target.style.borderColor = "#059669";
                  e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkTheme ? "#404040" : "#d1d5db";
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
                  e.target.style.borderColor = "#059669";
                  e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDarkTheme ? "#404040" : "#d1d5db";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={getStyles(isDarkTheme).termsContainer}>
              <p style={getStyles(isDarkTheme).termsText}>
                By creating an account, you agree to our{" "}
                <a href="#" style={getStyles(isDarkTheme).termsLink}>Terms of Service</a>{" "}
                and{" "}
                <a href="#" style={getStyles(isDarkTheme).termsLink}>Privacy Policy</a>
              </p>
            </div>

            {error && (
              <div style={getStyles(isDarkTheme).errorContainer}>
                <span style={getStyles(isDarkTheme).errorText}>{error}</span>
              </div>
            )}

            <button
              style={{
                ...getStyles(isDarkTheme).button,
                ...(isLoading || !name || !email || !password ? getStyles(isDarkTheme).buttonDisabled : {}),
              }}
              className="button"
              onClick={handleRegister}
              disabled={isLoading || !name || !email || !password}
              onMouseEnter={(e) => {
                if (!isLoading && name && email && password) {
                  e.currentTarget.style.background = "#047857";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && name && email && password) {
                  e.currentTarget.style.background = "#059669";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? <div style={getStyles(isDarkTheme).spinner}></div> : "Create Account"}
            </button>

            <div style={getStyles(isDarkTheme).links}>
              <a
                href="#"
                style={getStyles(isDarkTheme).link}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Already have an account? <strong>Sign in</strong>
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

          @keyframes bounce {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-6px) rotate(2deg); }
            50% { transform: translateY(-12px) rotate(0deg); }
            75% { transform: translateY(-6px) rotate(-2deg); }
          }

          @keyframes floatSlow {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-12px) translateX(8px); }
            66% { transform: translateY(-6px) translateX(-5px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .tip-card {
            animation: fadeInUp 1.2s ease-out;
          }

          .benefit-icon {
            animation: bounce 3s ease-in-out infinite;
          }

          .benefit-icon:nth-child(1) { animation-delay: 0s; }
          .benefit-icon:nth-child(2) { animation-delay: 1s; }
          .benefit-icon:nth-child(3) { animation-delay: 2s; }

          .stat {
            animation: slideIn 0.8s ease-out;
          }

          .stat:nth-child(1) { animation-delay: 0.3s; }
          .stat:nth-child(2) { animation-delay: 0.6s; }
          .stat:nth-child(3) { animation-delay: 0.9s; }

          .floating-element {
            position: absolute;
            animation: floatSlow 7s ease-in-out infinite;
          }

          .floating-1 {
            top: 15%;
            right: 8%;
            animation-delay: 0s;
          }

          .floating-2 {
            top: 70%;
            right: 12%;
            animation-delay: 2.5s;
          }

          .floating-3 {
            top: 40%;
            left: 8%;
            animation-delay: 5s;
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
            
            .register-card {
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
            .register-card {
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
        ? "#1a1a1a" // Black background like dashboard
        : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
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
      background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)", // Dark purple gradient
      position: "relative",
    },

    brandSection: {
      textAlign: "center",
      marginBottom: "50px",
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

    tipSection: {
      maxWidth: "400px",
      marginBottom: "50px",
    },

    tipCard: {
      background: isDark 
        ? "rgba(26, 26, 26, 0.8)" // Dark card matching dashboard
        : "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(10px)",
      padding: "30px",
      borderRadius: "20px",
      border: isDark 
        ? "2px solid rgba(255, 255, 255, 0.1)" 
        : "2px solid rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    },

    tipIcon: {
      marginBottom: "20px",
      display: "flex",
      justifyContent: "center",
    },

    tip: {
      fontSize: "16px",
      color: isDark ? "#ffffff" : "#000000", // White text in dark theme, black in light
      lineHeight: "1.6",
      margin: "0",
      fontWeight: "600", // Bold
    },

    benefits: {
      display: "flex",
      gap: "30px",
      justifyContent: "center",
      marginBottom: "40px",
    },

    benefit: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
      color: "#000000", // Black text
      fontSize: "13px",
      fontWeight: "800", // Very bold
      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)",
    },

    benefitIcon: {
      padding: "8px",
      background: "rgba(255, 255, 255, 0.2)",
      borderRadius: "12px",
      border: "2px solid rgba(0, 0, 0, 0.1)",
    },

    stats: {
      display: "flex",
      gap: "40px",
      justifyContent: "center",
    },

    stat: {
      textAlign: "center",
      color: "#000000", // Black text
      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.5)",
    },

    statNumber: {
      fontSize: "24px",
      fontWeight: "900", // Very bold
      marginBottom: "4px",
    },

    statLabel: {
      fontSize: "12px",
      fontWeight: "700", // Bold
    },

    // Right side - Register card
    rightSide: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      minWidth: "400px",
    },

    registerCard: {
      width: "100%",
      maxWidth: "380px",
      background: isDark ? "#1a1a1a" : "#ffffff", // Same black as dashboard
      borderRadius: "16px",
      padding: "40px 32px",
      boxShadow: isDark 
        ? "0 20px 40px rgba(0, 0, 0, 0.6)" 
        : "0 20px 40px rgba(0, 0, 0, 0.1)",
      border: isDark ? "1px solid #2d2d2d" : "1px solid #e5e7eb", // Slightly lighter border
    },

    header: {
      textAlign: "center",
      marginBottom: "32px",
    },

    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: isDark ? "#ffffff" : "#111827",
      margin: "0 0 8px 0",
      letterSpacing: "-0.5px",
    },

    subtitle: {
      fontSize: "14px",
      color: isDark ? "#9ca3af" : "#6b7280",
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
      color: isDark ? "#ffffff" : "#111827",
      background: isDark ? "#2d2d2d" : "#f9fafb", // Slightly lighter than card
      border: isDark ? "1px solid #404040" : "1px solid #d1d5db",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      boxSizing: "border-box",
    } as React.CSSProperties,

    termsContainer: {
      marginBottom: "24px",
    },

    termsText: {
      fontSize: "12px",
      color: isDark ? "#9ca3af" : "#6b7280",
      lineHeight: "1.4",
      margin: "0",
      textAlign: "center",
    },

    termsLink: {
      color: "#059669",
      textDecoration: "none",
      fontWeight: "500",
    },

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
      background: "#059669",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      marginBottom: "20px",
    } as React.CSSProperties,

    buttonDisabled: {
      background: "#9ca3af",
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

    links: {
      textAlign: "center",
    },

    link: {
      fontSize: "14px",
      color: isDark ? "#9ca3af" : "#6b7280",
      textDecoration: "none",
      cursor: "pointer",
      transition: "color 0.2s ease",
    },
  };
}