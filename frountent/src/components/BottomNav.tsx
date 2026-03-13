import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavProps {
  projectId?: string;
}

export default function BottomNav({ projectId }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isChat = location.pathname.includes("/chat");
  const isDashboard = location.pathname.includes("/dashboard");

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "12px 0 18px",
      background: "rgba(20, 20, 20, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(255,255,255,0.04)",
      zIndex: 100,
    }}>
      {/* Pill Container */}
      <div style={{
        display: "flex",
        background: "rgba(40, 40, 40, 0.9)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}>
        {/* Dashboard Tile */}
        <button
          onClick={() => projectId && navigate(`/dashboard/${projectId}`)}
          title="Board"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            background: isDashboard
              ? "rgba(11, 125, 224, 0.15)"
              : "transparent",
            border: "none",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            color: isDashboard ? "#3b9eff" : "#666",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => {
            if (!isDashboard) e.currentTarget.style.color = "#aaa";
          }}
          onMouseLeave={(e) => {
            if (!isDashboard) e.currentTarget.style.color = "#666";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          <span>Board</span>
          {isDashboard && (
            <div style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#3b9eff",
              boxShadow: "0 0 6px #3b9eff",
              marginLeft: "2px",
            }} />
          )}
        </button>

        {/* Chat Tile */}
        <button
          onClick={() => projectId && navigate(`/chat/${projectId}`)}
          title="Chat"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 24px",
            background: isChat
              ? "rgba(139, 92, 246, 0.15)"
              : "transparent",
            border: "none",
            color: isChat ? "#a78bfa" : "#666",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontSize: "13px",
            fontWeight: "600",
            letterSpacing: "0.2px",
          }}
          onMouseEnter={(e) => {
            if (!isChat) e.currentTarget.style.color = "#aaa";
          }}
          onMouseLeave={(e) => {
            if (!isChat) e.currentTarget.style.color = "#666";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Chat</span>
          {isChat && (
            <div style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#a78bfa",
              boxShadow: "0 0 6px #a78bfa",
              marginLeft: "2px",
            }} />
          )}
        </button>
      </div>
    </nav>
  );
}
