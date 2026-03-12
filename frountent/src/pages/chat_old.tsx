import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";

const styles: any = {
  container: {
    background: "#1a1a1a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "70px",
  },

  topBar: {
    background: "#242424",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
  },

  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 68, 68, 0.2)",
    background: "transparent",
    color: "#ff6b6b",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
  },
};

export default function Chat() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { projectId } = useParams();

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.title}>💬 Team Chat</div>
        <button 
          style={styles.logoutBtn} 
          onClick={logout}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.1)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
        <div style={{ fontSize: "16px", marginBottom: "8px" }}>Team Chat Coming Soon</div>
        <div style={{ fontSize: "13px" }}>Real-time messaging, voice & video calls</div>
      </div>

      <BottomNav projectId={projectId} />
    </div>
  );
}
