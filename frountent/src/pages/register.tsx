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

  const navigate = useNavigate();

  // Productivity tips for new users
  const tips = [
    { text: "Start small, think big. Every great journey begins with a single step.", icon: "🌱" },
    { text: "Consistency beats perfection. Small daily actions create lasting results.", icon: "🎯" },
    { text: "Break big goals into smaller tasks. Progress is progress, no matter how small.", icon: "🧩" },
    { text: "Celebrate your wins. Acknowledging progress fuels motivation.", icon: "🎉" },
    { text: "Focus on one thing at a time. Multitasking is the enemy of deep work.", icon: "🎪" },
    { text: "Your future self will thank you for the habits you build today.", icon: "⏰" },
    { text: "Productivity isn't about being busy. It's about being effective.", icon: "💡" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", icon: "🌳" }
  ];

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
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
    <div style={styles.container} className="container">
      {/* Desktop: Left side with tips and animations */}
      <div style={styles.leftSide} className="left-side">
        <div style={styles.brandSection}>
          <div style={styles.logo}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
          </div>
          <h1 style={styles.brandName}>Join Synq</h1>
          <p style={styles.brandTagline}>Start your productivity journey today</p>
        </div>

        <div style={styles.tipSection}>
          <div style={styles.tipCard} className="tip-card" key={currentTip}>
            <div style={styles.tipIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4l3 3h3V8h-3l-3 3z"/>
                <path d="M22 9c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z"/>
              </svg>
            </div>
            <p style={styles.tip}>
              {tips[currentTip].text}
            </p>
          </div>
        </div>

        <div style={styles.benefits}>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <span>Free Forever</span>
          </div>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <span>Secure & Private</span>
          </div>
          <div style={styles.benefit}>
            <div style={styles.benefitIcon} className="benefit-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span>Instant Setup</span>
          </div>
        </div>

        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Happy Users</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>50K+</div>
            <div style={styles.statLabel}>Tasks Completed</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNumber}>99%</div>
            <div style={styles.statLabel}>Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right side: Compact register card */}
      <div style={styles.rightSide} className="right-side">
        <div style={styles.registerCard} className="register-card">
          <div style={styles.header}>
            <h2 style={styles.title} className="title">Create Account</h2>
            <p style={styles.subtitle} className="subtitle">Join thousands of productive users</p>
          </div>

          <div style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                className="input"
                placeholder="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#10b981";
                  e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
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
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={(e) => {
                  e.target.style.borderColor = "#10b981";
                  e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
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
                  e.target.style.borderColor = "#10b981";
                  e.target.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#3a3a3a";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={styles.termsContainer}>
              <p style={styles.termsText}>
                By creating an account, you agree to our{" "}
                <a href="#" style={styles.termsLink}>Terms of Service</a>{" "}
                and{" "}
                <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </p>
            </div>

            {error && (
              <div style={styles.errorContainer}>
                <span style={styles.errorText}>{error}</span>
              </div>
            )}

            <button
              style={{
                ...styles.button,
                ...(isLoading || !name || !email || !password ? styles.buttonDisabled : {}),
              }}
              className="button"
              onClick={handleRegister}
              disabled={isLoading || !name || !email || !password}
              onMouseEnter={(e) => {
                if (!isLoading && name && email && password) {
                  e.currentTarget.style.background = "#059669";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && name && email && password) {
                  e.currentTarget.style.background = "#10b981";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? <div style={styles.spinner}></div> : "Create Account"}
            </button>

            <div style={styles.links}>
              <a
                href="#"
                style={styles.link}
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
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .tip-card {
            animation: fadeInUp 0.6s ease-out;
          }

          .benefit-icon {
            animation: bounce 2s ease-in-out infinite;
          }

          .benefit-icon:nth-child(1) { animation-delay: 0s; }
          .benefit-icon:nth-child(2) { animation-delay: 0.5s; }
          .benefit-icon:nth-child(3) { animation-delay: 1s; }

          .stat {
            animation: slideIn 0.8s ease-out;
          }

          .stat:nth-child(1) { animation-delay: 0.2s; }
          .stat:nth-child(2) { animation-delay: 0.4s; }
          .stat:nth-child(3) { animation-delay: 0.6s; }

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
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
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

  tipSection: {
    maxWidth: "400px",
    marginBottom: "50px",
  },

  tipCard: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
  },

  tipIcon: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
  },

  tip: {
    fontSize: "16px",
    color: "#ffffff",
    lineHeight: "1.6",
    margin: "0",
    fontWeight: "400",
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
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
  },

  benefitIcon: {
    padding: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },

  stats: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
  },

  stat: {
    textAlign: "center",
    color: "#ffffff",
  },

  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "12px",
    opacity: 0.8,
    fontWeight: "400",
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

  termsContainer: {
    marginBottom: "24px",
  },

  termsText: {
    fontSize: "12px",
    color: "#999999",
    lineHeight: "1.4",
    margin: "0",
    textAlign: "center",
  },

  termsLink: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "500",
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
    background: "#10b981",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    marginBottom: "20px",
  } as React.CSSProperties,

  buttonDisabled: {
    background: "#2a5d4a",
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
    color: "#b3b3b3",
    textDecoration: "none",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
};