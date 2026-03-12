import { useNavigate, useLocation } from "react-router-dom";

const styles: any = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#242424",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "space-around",
    padding: "8px 0",
    zIndex: 100,
  },

  navItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#888",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "12px",
    fontWeight: "500",
  },

  navItemActive: {
    color: "#0b7de0",
  },

  icon: {
    fontSize: "20px",
  },
};

interface BottomNavProps {
  projectId?: string;
}

export default function BottomNav({ projectId }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isChat = location.pathname.includes("/chat");
  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <nav style={styles.nav}>
      <button
        style={{
          ...styles.navItem,
          ...(isDashboard ? styles.navItemActive : {}),
        }}
        onClick={() => projectId && navigate(`/dashboard/${projectId}`)}
      >
        <div style={styles.icon}>📊</div>
        <div>Dashboard</div>
      </button>

      <button
        style={{
          ...styles.navItem,
          ...(isChat ? styles.navItemActive : {}),
        }}
        onClick={() => projectId && navigate(`/chat/${projectId}`)}
      >
        <div style={styles.icon}>💬</div>
        <div>Chat</div>
      </button>
    </nav>
  );
}
