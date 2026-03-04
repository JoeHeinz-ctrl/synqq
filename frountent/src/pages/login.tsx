import { useState } from "react";
import { loginUser } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/api"; // backend call


export default function Login({ onLogin, onShowRegister }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = useGoogleLogin({
  flow: "auth-code",   // ⭐ CHANGE THIS
  onSuccess: async (codeResponse) => {
    try {
      console.log("Google Code →", codeResponse);

      await googleLogin(codeResponse.code);  // ⭐ SEND CODE

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  },
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

    // ✅ Store token
    localStorage.setItem("token", data.access_token);

    // ✅ Notify app (redirect / state update)
    onLogin();

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
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>One account. Any device.</h1>
          <h2 style={styles.subtitle}>Just for you.</h2>
          <p style={styles.description}>Sign in to get started</p>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              style={styles.input}
              placeholder="Phone number or email"
              type="text"
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

          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>Remember my ID</span>
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
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            onMouseEnter={(e) => {
              if (!isLoading && email && password) {
                e.currentTarget.style.background = "#0a6bc2";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && email && password) {
                e.currentTarget.style.background = "#0b7de0";
              }
            }}
          >
            {isLoading ? <div style={styles.spinner}></div> : "Next"}
          </button>

          <div style={styles.links}>
            
            <a
              href="#"
              style={styles.link}
              onClick={(e) => {
                e.preventDefault();
                onShowRegister();
              }}
            >
              Create account
            </a>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
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
            Login with Google
          </button>
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
  loginCard: {
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
    margin: "0 0 8px 0",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 20px 0",
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
  checkboxContainer: {
    marginBottom: "32px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    marginRight: "10px",
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
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
  },
  link: {
    fontSize: "14px",
    color: "#b3b3b3",
    textDecoration: "underline",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  linkDivider: {
    margin: "0 12px",
    color: "#666666",
  },
  divider: {
    margin: "30px 0",
    display: "flex",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#3a3a3a",
  },
  googleButton: {
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#e0e0e0",
    background: "#3a3a3a",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
};