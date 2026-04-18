import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, createTaskFromChat, fetchProjectMembers } from "../services/api";
import BottomNav from "../components/BottomNav";
import { useChat } from "../hooks/useChat";
import { useWebRTC } from "../hooks/useWebRTC";
import AiTaskSuggestion from "../components/AiTaskSuggestion";
import EditTaskModal from "../components/EditTaskModal";
import { useTheme } from "../context/ThemeContext";
import { MessageSquare, Users, Paperclip, Send } from "lucide-react";

const styles: any = {
  container: (colors: any) => ({
    background: colors.background,
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    paddingBottom: "70px",
  }),

  topBar: (colors: any, isDark: boolean) => ({
    background: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
  }),

  title: (colors: any) => ({
    fontSize: "18px",
    fontWeight: "600",
    color: colors.text,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }),

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
    position: "relative",
  },

  sidebar: (colors: any) => ({
    width: "280px",
    background: colors.surface,
    borderRight: `1px solid ${colors.border}`,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    overflow: "hidden",
  }),

  sidebarMobile: (colors: any) => ({
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    maxWidth: "320px",
    background: colors.surface,
    zIndex: 100,
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease",
  }),

  sidebarMobileOpen: {
    transform: "translateX(0)",
  },

  sidebarHeader: (colors: any) => ({
    padding: "18px 16px",
    borderBottom: `1px solid ${colors.border}`,
    fontSize: "11px",
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }),

  userList: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "12px",
  },

  userItem: {
    padding: "14px 12px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "6px",
  },

  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    flexShrink: 0,
  },

  userInfo: {
    flex: 1,
    minWidth: 0,
  },

  userName: (colors: any) => ({
    fontSize: "15px",
    fontWeight: "600",
    color: colors.text,
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  userStatus: (colors: any) => ({
    fontSize: "11px",
    color: colors.textSecondary,
  }),

  callButtons: {
    display: "flex",
    gap: "4px",
  },

  callBtn: (colors: any) => ({
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: colors.primaryLight,
    color: colors.primary,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    transition: "all 0.2s ease",
  }),

  chatArea: (colors: any) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    background: colors.background,
    overflow: "hidden",
  }),

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

  messageName: (colors: any) => ({
    fontSize: "12px",
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: "4px",
  }),

  messageBubble: (colors: any, isDark: boolean) => ({
    padding: "10px 14px",
    borderRadius: "12px",
    background: colors.surface,
    color: colors.text,
    fontSize: "14px",
    lineHeight: "1.5",
    wordWrap: "break-word",
    boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
  }),

  messageBubbleOwn: (colors: any) => ({
    background: colors.primary,
    color: "#ffffff",
  }),

  messageTime: (colors: any) => ({
    fontSize: "11px",
    color: colors.textSecondary,
    marginTop: "4px",
  }),

  inputArea: (colors: any, isDark: boolean) => ({
    padding: "16px",
    background: colors.surface,
    borderTop: `1px solid ${colors.border}`,
    display: "flex",
    gap: "12px",
    alignItems: "center",
    boxShadow: isDark ? "none" : "0 -1px 3px rgba(0,0,0,0.06)",
  }),

  input: (colors: any) => ({
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    color: colors.text,
    fontSize: "14px",
    outline: "none",
  }),

  sendBtn: (colors: any) => ({
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "none",
    background: colors.primary,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    transition: "all 0.2s ease",
  }),

  fileInput: {
    display: "none",
  },

  attachBtn: (colors: any) => ({
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: `1px solid ${colors.border}`,
    background: "transparent",
    color: colors.textSecondary,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    transition: "all 0.2s ease",
  }),

  callModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  callContent: {
    background: "#242424",
    borderRadius: "16px",
    padding: "24px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
  },

  videoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    marginBottom: "16px",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  localVideo: {
    position: "absolute",
    bottom: "16px",
    right: "16px",
    width: "150px",
    aspectRatio: "16/9",
    borderRadius: "8px",
    border: "2px solid #fff",
  },

  callControls: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
  },

  controlBtn: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    transition: "all 0.2s ease",
    color: "#fff",
  },

  audioCallView: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },

  audioAvatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    color: "#fff",
    fontWeight: "600",
  },

  emptyState: (colors: any) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textSecondary,
    gap: "12px",
  }),
};

export default function Chat() {
  const { logout } = useAuth();
  const { projectId } = useParams();
  const theme = useTheme();
  const colors = theme.getThemeColors();
  const isDark = theme.mode === 'dark';
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // AI Task Suggestion state
  const [aiSuggestions, setAiSuggestions] = useState<Map<string, any>>(new Map());
  const [ignoredSuggestions, setIgnoredSuggestions] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch all team members for the project (show regardless of online status)
  useEffect(() => {
    if (!projectId || !currentUser) return;
    let mounted = true;
    (async () => {
      try {
        const members = await fetchProjectMembers(parseInt(projectId));
        if (mounted) setAllMembers(members);
      } catch {
        if (mounted && currentUser) {
          setAllMembers([{ id: currentUser.id, name: currentUser.name }]);
        }
      }
    })();
    return () => { mounted = false; };
  }, [projectId, currentUser]);

  const { messages, users, isConnected, joinNotification, sendMessage, sendFile, socket } = useChat(
    projectId,
    currentUser?.id,
    currentUser?.name
  );

  const { callState, answerCall, rejectCall, endCall, toggleMute, isMuted } = useWebRTC(socket, currentUser?.id);

  // Listen for AI task suggestions
  useEffect(() => {
    if (!socket) return;

    const handleAiSuggestion = (data: any) => {
      console.log("🤖 AI suggestion received:", data);
      setAiSuggestions((prev) => {
        const newMap = new Map(prev);
        newMap.set(data.messageId, data.suggestion);
        return newMap;
      });
    };

    socket.on("ai_task_suggestion", handleAiSuggestion);

    return () => {
      socket.off("ai_task_suggestion", handleAiSuggestion);
    };
  }, [socket]);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendFile(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

  // AI Task Suggestion handlers
  const handleCreateTask = async (taskData: any) => {
    try {
      await createTaskFromChat(
        taskData.title,
        Number(projectId),
        taskData.status || "TODO",
        taskData.description,
        taskData.dueDate,
        taskData.assignee?.id
      );

      // Remove suggestion after creating task
      if (editingTask?.messageId) {
        setAiSuggestions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(editingTask.messageId);
          return newMap;
        });
      }

      console.log("✅ Task created successfully");
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleEditTask = (messageId: string, suggestion: any) => {
    setEditingTask({
      messageId,
      title: suggestion.title,
      assignedUserId: suggestion.assignee?.id,
      assignedUserName: suggestion.assignee?.name,
      dueDate: suggestion.dueDate,
      description: "",
    });
    setShowEditModal(true);
  };

  const handleSaveEditedTask = async (taskData: any) => {
    if (!editingTask) return;

    try {
      await createTaskFromChat(
        taskData.title,
        Number(projectId),
        "TODO",
        taskData.description,
        taskData.dueDate,
        taskData.assignedUserId
      );

      // Remove suggestion after creating task
      setAiSuggestions((prev) => {
        const newMap = new Map(prev);
        newMap.delete(editingTask.messageId);
        return newMap;
      });

      setShowEditModal(false);
      setEditingTask(null);
      console.log("✅ Task created successfully");
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleIgnoreSuggestion = (messageId: string) => {
    setIgnoredSuggestions((prev) => new Set(prev).add(messageId));
    setAiSuggestions((prev) => {
      const newMap = new Map(prev);
      newMap.delete(messageId);
      return newMap;
    });
  };

  return (
    <div style={styles.container(colors)}>
      <div style={styles.topBar(colors, isDark)}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                background: "transparent",
                border: "none",
                color: colors.text,
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <Users size={20} />
            </button>
          )}
          <div style={styles.title(colors)}>
            <MessageSquare size={20} style={{ display: "inline-block", verticalAlign: "middle" }} />
            <span style={{ marginLeft: "8px" }}>Team Chat</span>
            {isConnected && <div style={styles.statusDot} title="Connected" />}
          </div>
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
        <div
          style={{
            ...styles.sidebar(colors),
            ...(isMobile ? styles.sidebarMobile(colors) : {}),
            ...(isMobile && showSidebar ? styles.sidebarMobileOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader(colors)}>
            Members · {allMembers.length}
            {isMobile && (
              <button
                onClick={() => setShowSidebar(false)}
                style={{
                  float: "right",
                  background: "transparent",
                  border: "none",
                  color: colors.textSecondary,
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={styles.userList}>
            {allMembers.map((member) => {
              const isOnline = users.some((u) => u.id === member.id);
              const isSelf = member.id === currentUser?.id;
              return (
                <div
                  key={member.id}
                  style={{
                    ...styles.userItem,
                    background: isSelf ? colors.primaryLight : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelf) e.currentTarget.style.background = colors.surfaceHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelf) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Avatar with online indicator */}
                  <div style={{ position: "relative" }}>
                    <div style={{
                      ...styles.userAvatar,
                      opacity: isOnline ? 1 : 0.5,
                    }}>
                      {getInitials(member.name)}
                    </div>
                    {isOnline && (
                      <div style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#10b981",
                        border: `2px solid ${colors.surface}`,
                        boxShadow: "0 0 6px rgba(16,185,129,0.8), 0 0 12px rgba(16,185,129,0.4)",
                      }} />
                    )}
                  </div>
                  <div style={styles.userInfo}>
                    <div style={{ ...styles.userName(colors), opacity: isOnline ? 1 : 0.6 }}>
                      {member.name}{isSelf && " (You)"}
                    </div>
                    <div style={{ ...styles.userStatus(colors), color: isOnline ? "#10b981" : colors.textSecondary }}>
                      {isOnline ? "In project" : "Offline"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <div style={styles.chatArea(colors)}>
          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.emptyState(colors)}>
                <MessageSquare size={48} style={{ color: colors.textSecondary, opacity: 0.5 }} />
                <div style={{ fontSize: "16px" }}>No messages yet</div>
                <div style={{ fontSize: "13px" }}>
                  Start the conversation!
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isOwn = msg.userId === currentUser?.id;
                const isFile = msg.type === "file";
                
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
                        <div style={styles.messageName(colors)}>{msg.userName}</div>
                      )}
                      <div
                        style={{
                          ...styles.messageBubble(colors, isDark),
                          ...(isOwn ? styles.messageBubbleOwn(colors) : {}),
                        }}
                      >
                        {isFile ? (
                          <a
                            href={msg.fileUrl}
                            download={msg.fileName}
                            style={{
                              color: isOwn ? "#fff" : colors.primary,
                              textDecoration: "none",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {msg.content}
                          </a>
                        ) : (
                          msg.content
                        )}
                      </div>
                      <div style={styles.messageTime(colors)}>
                        {formatTime(msg.timestamp)}
                      </div>
                      
                      {/* AI Task Suggestion */}
                      {isOwn && aiSuggestions.has(msg.id) && !ignoredSuggestions.has(msg.id) && (
                        <AiTaskSuggestion
                          messageId={msg.id}
                          suggestion={aiSuggestions.get(msg.id)}
                          onCreateTask={() => handleCreateTask(aiSuggestions.get(msg.id))}
                          onEdit={() => handleEditTask(msg.id, aiSuggestions.get(msg.id))}
                          onIgnore={() => handleIgnoreSuggestion(msg.id)}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea(colors, isDark)}>
            <input
              ref={fileInputRef}
              type="file"
              style={styles.fileInput}
              onChange={handleFileSelect}
            />
            <button
              style={styles.attachBtn(colors)}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.surfaceHover;
                e.currentTarget.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <Paperclip size={18} />
            </button>
            <input
              style={styles.input(colors)}
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              style={styles.sendBtn(colors)}
              onClick={handleSend}
              disabled={!messageInput.trim()}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.primary;
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Incoming call notification (audio only) */}
      {callState.isReceivingCall && (
        <div style={{
          position: "fixed", bottom: "90px", right: "20px",
          background: "rgba(20, 20, 20, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "16px", padding: "16px 20px",
          display: "flex", alignItems: "center", gap: "14px",
          zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          minWidth: "260px",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "2px" }}>
              {callState.caller?.name} is calling
            </div>
            <div style={{ fontSize: "11px", color: "#888" }}>Audio call</div>
          </div>
          <button
            onClick={answerCall}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "none",
              background: "#10b981", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >Accept</button>
          <button
            onClick={rejectCall}
            style={{ padding: "8px 14px", borderRadius: "10px", border: "none",
              background: "#ef4444", color: "#fff", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >Decline</button>
        </div>
      )}

      {/* Active call bar */}
      {callState.isInCall && (
        <div style={{
          position: "fixed", bottom: "90px", left: "50%", transform: "translateX(-50%)",
          background: "rgba(16,185,129,0.15)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: "50px", padding: "10px 20px",
          display: "flex", alignItems: "center", gap: "12px",
          zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981",
            boxShadow: "0 0 8px #10b981", animation: "pulse 1.5s infinite" }} />
          <span style={{ color: "#10b981", fontSize: "13px", fontWeight: "700" }}>In call</span>
          <button
            onClick={toggleMute}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "none",
              background: isMuted ? "#ef4444" : "rgba(255,255,255,0.1)",
              color: "#fff", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
          >{isMuted ? "Unmute" : "Mute"}</button>
          <button
            onClick={endCall}
            style={{ padding: "6px 12px", borderRadius: "8px", border: "none",
              background: "#ef4444", color: "#fff", fontWeight: "600", fontSize: "12px", cursor: "pointer" }}
          >End</button>
        </div>
      )}


      <BottomNav projectId={projectId} />
      
      {/* Edit Task Modal */}
      {showEditModal && (
        <EditTaskModal
          isOpen={showEditModal}
          initialData={{
            title: editingTask?.title || "",
            assignedUserId: editingTask?.assignedUserId,
            assignedUserName: editingTask?.assignedUserName,
            dueDate: editingTask?.dueDate,
            description: editingTask?.description || "",
          }}
          teamMembers={allMembers.map((u: any) => ({ id: u.id, name: u.name }))}
          onSave={handleSaveEditedTask}
          onCancel={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* Join notification popup */}
      {joinNotification && (
        <div style={{
          position: "fixed",
          bottom: "88px",
          right: "20px",
          background: "rgba(30, 30, 30, 0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "14px",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 9999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.15)",
          animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: "280px",
        }}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: "700",
            color: "#fff",
            boxShadow: "0 0 12px rgba(16,185,129,0.5)",
            flexShrink: 0,
          }}>
            {joinNotification.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>
              {joinNotification.name} joined
            </div>
            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "2px" }}>
              Now in this project
            </div>
          </div>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px rgba(16,185,129,0.8)",
            flexShrink: 0,
          }} />
          <style>{`
            @keyframes slideInRight {
              from { opacity: 0; transform: translateX(40px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
