import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser } from "../services/api";
import BottomNav from "../components/BottomNav";
import { useChat } from "../hooks/useChat";

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
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
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
    overflow: "hidden",
  },

  sidebar: {
    width: "280px",
    background: "#242424",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
  },

  sidebarHeader: {
    padding: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "13px",
    fontWeight: "600",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  userList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
  },

  userItem: {
    padding: "12px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "4px",
  },

  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "2px",
  },

  userStatus: {
    fontSize: "11px",
    color: "#888",
  },

  callButtons: {
    display: "flex",
    gap: "4px",
  },

  callBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: "rgba(11,125,224,0.1)",
    color: "#0b7de0",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },

  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#1a1a1a",
  },

  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  message: {
    display: "flex",
    gap: "12px",
    maxWidth: "70%",
  },

  messageOwn: {
    alignSelf: "flex-end",
    flexDirection: "row-reverse",
  },

  messageAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: "12px",
    flexShrink: 0,
  },

  messageContent: {
    flex: 1,
  },

  messageName: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#888",
    marginBottom: "4px",
  },

  messageBubble: {
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#242424",
    color: "#fff",
    fontSize: "14px",
    lineHeight: "1.5",
    wordWrap: "break-word",
  },

  messageBubbleOwn: {
    background: "#0b7de0",
  },

  messageTime: {
    fontSize: "11px",
    color: "#666",
    marginTop: "4px",
  },

  inputArea: {
    padding: "16px",
    background: "#242424",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },

  sendBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: "#0b7de0",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    transition: "all 0.2s ease",
  },

  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    gap: "12px",
  },
};

export default function Chat() {
  const { logout } = useAuth();
  const { projectId } = useParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, users, isConnected, sendMessage } = useChat(
    projectId,
    currentUser?.id
  );

  useEffect(() => {
    getCurrentUser().then(setCurrentUser).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.title}>
          💬 Team Chat
          {isConnected && <div style={styles.statusDot} title="Connected" />}
        </div>
        <button
          style={styles.logoutBtn}
          onClick={logout}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Logout
        </button>
      </div>

      <div style={styles.mainContent}>
        {/* Sidebar with users */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            Team Members ({users.length})
          </div>
          <div style={styles.userList}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  ...styles.userItem,
                  background:
                    user.id === currentUser?.id
                      ? "rgba(11,125,224,0.1)"
                      : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (user.id !== currentUser?.id) {
                    e.currentTarget.style.background = "#2a2a2a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (user.id !== currentUser?.id) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <div style={styles.userAvatar}>{getInitials(user.name)}</div>
                <div style={styles.userInfo}>
                  <div style={styles.userName}>
                    {user.name}
                    {user.id === currentUser?.id && " (You)"}
                  </div>
                  <div style={styles.userStatus}>
                    {user.online ? "🟢 Online" : "⚫ Offline"}
                  </div>
                </div>
                {user.id !== currentUser?.id && user.online && (
                  <div style={styles.callButtons}>
                    <button
                      style={styles.callBtn}
                      title="Audio call"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.1)";
                      }}
                    >
                      📞
                    </button>
                    <button
                      style={styles.callBtn}
                      title="Video call"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.1)";
                      }}
                    >
                      📹
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={styles.chatArea}>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: "48px" }}>💬</div>
                <div style={{ fontSize: "16px" }}>No messages yet</div>
                <div style={{ fontSize: "13px" }}>
                  Start the conversation!
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.userId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      ...(isOwn ? styles.messageOwn : {}),
                    }}
                  >
                    <div style={styles.messageAvatar}>
                      {getInitials(msg.userName)}
                    </div>
                    <div style={styles.messageContent}>
                      {!isOwn && (
                        <div style={styles.messageName}>{msg.userName}</div>
                      )}
                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(isOwn ? styles.messageBubbleOwn : {}),
                        }}
                      >
                        {msg.content}
                      </div>
                      <div style={styles.messageTime}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              style={styles.input}
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              style={styles.sendBtn}
              onClick={handleSend}
              disabled={!messageInput.trim()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a8cf0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0b7de0";
              }}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <BottomNav projectId={projectId} />
    </div>
  );
}
