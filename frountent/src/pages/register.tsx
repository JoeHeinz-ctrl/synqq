import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register({ onBack }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setIsLoading(true);

    try {
      await registerUser(name, email, password);
      onBack(); // return to login
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
    <div style={styles.container}>
      <div style={styles.registerCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.description}>Join us to get started</p>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => {
                e.target.style.borderBottom = "2px solid #0b7de0";
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = "2px solid #3a3a3a";
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => {
                e.target.style.borderBottom = "2px solid #0b7de0";
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = "2px solid #3a3a3a";
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={(e) => {
                e.target.style.borderBottom = "2px solid #0b7de0";
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = "2px solid #3a3a3a";
              }}
            />
          </div>

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}

          <button
            style={{
              ...styles.button,
              ...(isLoading || !name || !email || !password
                ? styles.buttonDisabled
                : {}),
            }}
            onClick={handleRegister}
            disabled={isLoading || !name || !email || !password}
            onMouseEnter={(e) => {
              if (!isLoading && name && email && password) {
                e.currentTarget.style.background = "#0a6bc2";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && name && email && password) {
                e.currentTarget.style.background = "#0b7de0";
              }
            }}
          >
            {isLoading ? <div style={styles.spinner}></div> : "Create Account"}
          </button>

          <div style={styles.backLink}>
            <button
              style={styles.backButton}
              onClick={onBack}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#333333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ marginRight: "8px" }}
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="#b3b3b3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Login
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
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
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a1a",
    padding: "20px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  registerCard: {
    width: "100%",
    maxWidth: "460px",
    background: "#242424",
    borderRadius: "20px",
    padding: "60px 50px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 12px 0",
    letterSpacing: "-0.3px",
  },
  description: {
    fontSize: "15px",
    color: "#b3b3b3",
    margin: "0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "32px",
    position: "relative",
  },
  input: {
    width: "100%",
    padding: "12px 0",
    fontSize: "16px",
    color: "#ffffff",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid #3a3a3a",
    outline: "none",
    transition: "border-color 0.3s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxSizing: "border-box",
  } as React.CSSProperties,
  errorContainer: {
    padding: "12px 16px",
    marginBottom: "20px",
    background: "rgba(220, 53, 69, 0.1)",
    border: "1px solid rgba(220, 53, 69, 0.3)",
    borderRadius: "8px",
    animation: "fadeIn 0.3s ease-out",
  },
  errorText: {
    fontSize: "14px",
    color: "#ff6b6b",
  },
  button: {
    width: "100%",
    padding: "16px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#ffffff",
    background: "#0b7de0",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    marginBottom: "24px",
  } as React.CSSProperties,
  buttonDisabled: {
    background: "#2a5580",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid rgba(255, 255, 255, 0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto",
  },
  backLink: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    fontSize: "14px",
    color: "#b3b3b3",
    background: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  } as React.CSSProperties,
};