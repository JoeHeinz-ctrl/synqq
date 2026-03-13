import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCurrentUser, createTaskFromChat } from "../services/api";
import BottomNav from "../components/BottomNav";
import { useChat } from "../hooks/useChat";
import { useWebRTC } from "../hooks/useWebRTC";
import AiTaskSuggestion from "../components/AiTaskSuggestion";
import EditTaskModal from "../components/EditTaskModal";

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
    flexShrink: 0,
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
    position: "relative",
  },

  sidebar: {
    width: "280px",
    background: "#242424",
    borderRight: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },

  sidebarMobile: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "100%",
    maxWidth: "300px",
    background: "#242424",
    zIndex: 100,
    transform: "translateX(-100%)",
    transition: "transform 0.3s ease",
  },

  sidebarMobileOpen: {
    transform: "translateX(0)",
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

  fileInput: {
    display: "none",
  },

  attachBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "transparent",
    color: "#888",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    transition: "all 0.2s ease",
  },

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

  const { messages, users, isConnected, sendMessage, sendFile, socket } = useChat(
    projectId,
    currentUser?.id,
    currentUser?.name
  );

  const { callState, localVideoRef, remoteVideoRef, startCall, answerCall, rejectCall, endCall, toggleMute, toggleSpeaker, isMuted, isSpeakerOn, callDuration, formatCallDuration } = useWebRTC(socket, currentUser?.id);

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

  const handleCallClick = (userId: number, callType: "audio" | "video") => {
    startCall(userId, callType);
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
  const handleCreateTask = async (messageId: string, taskData: any) => {
    try {
      await createTaskFromChat({
        title: taskData.title,
        project_id: Number(projectId),
        assigned_user_id: taskData.assignedUserId,
        description: taskData.description || `Created from chat message`,
        due_date: taskData.dueDate,
        chat_message_id: Number(messageId),
      });

      // Remove suggestion after creating task
      setAiSuggestions((prev) => {
        const newMap = new Map(prev);
        newMap.delete(messageId);
        return newMap;
      });

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

    await handleCreateTask(editingTask.messageId, taskData);
    setShowEditModal(false);
    setEditingTask(null);
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
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isMobile && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              👥
            </button>
          )}
          <div style={styles.title}>
            💬 Team Chat
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
            ...styles.sidebar,
            ...(isMobile ? styles.sidebarMobile : {}),
            ...(isMobile && showSidebar ? styles.sidebarMobileOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader}>
            Team Members ({users.length})
            {isMobile && (
              <button
                onClick={() => setShowSidebar(false)}
                style={{
                  float: "right",
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                ✕
              </button>
            )}
          </div>
          {users.length === 0 && (
            <div style={{ padding: "16px", color: "#666", fontSize: "13px", textAlign: "center" }}>
              This is a personal project. You can still use chat to organize your thoughts and notes!
            </div>
          )}
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
                      onClick={() => handleCallClick(user.id, "audio")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.1)";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 16.92c-.012-.039-.08-.12-.145-.182a2.918 2.918 0 0 0-.465-.344 15.447 15.447 0 0 0-1.898-1.029c-.769-.345-1.591-.672-2.426-.961a1.993 1.993 0 0 0-2.394.885l-.667 1.154a13.988 13.988 0 0 1-5.01-5.01l1.154-.667a1.993 1.993 0 0 0 .885-2.394 23.447 23.447 0 0 0-.961-2.426 15.447 15.447 0 0 0-1.029-1.898 2.918 2.918 0 0 0-.344-.465c-.062-.065-.143-.133-.182-.145a1.994 1.994 0 0 0-2.267.485L3.935 5.271a1.993 1.993 0 0 0-.485 1.913c.214.844.529 1.656.93 2.426.398.765.875 1.5 1.414 2.192a20.964 20.964 0 0 0 2.192 2.192c.692.539 1.427 1.016 2.192 1.414.77.401 1.582.716 2.426.93a1.993 1.993 0 0 0 1.913-.485l1.315-1.315a1.994 1.994 0 0 0 .485-2.267z"/>
                      </svg>
                    </button>
                    <button
                      style={styles.callBtn}
                      title="Video call"
                      onClick={() => handleCallClick(user.id, "video")}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(11,125,224,0.1)";
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23 7l-7 5 7 5V7z"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
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
                const isFile = msg.type === "file";
                const hasSuggestion = aiSuggestions.has(msg.id) && !ignoredSuggestions.has(msg.id);
                
                return (
                  <div key={msg.id}>
                    <div
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
                          {isFile ? (
                            <a
                              href={msg.fileUrl}
                              download={msg.fileName}
                              style={{
                                color: isOwn ? "#fff" : "#0b7de0",
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
                        <div style={styles.messageTime}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Task Suggestion */}
                    {hasSuggestion && isOwn && (
                      <div style={{ maxWidth: "70%", alignSelf: "flex-end", width: "100%" }}>
                        <AiTaskSuggestion
                          messageId={msg.id}
                          suggestion={aiSuggestions.get(msg.id)}
                          onCreateTask={(taskData) => handleCreateTask(msg.id, taskData)}
                          onEdit={() => handleEditTask(msg.id, aiSuggestions.get(msg.id))}
                          onIgnore={() => handleIgnoreSuggestion(msg.id)}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <input
              ref={fileInputRef}
              type="file"
              style={styles.fileInput}
              onChange={handleFileSelect}
            />
            <button
              style={styles.attachBtn}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#888";
              }}
            >
              📎
            </button>
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

      {/* Call Modal */}
      {(callState.isInCall || callState.isCalling || callState.isReceivingCall) && (
        <div style={styles.callModal}>
          <div style={styles.callContent}>
            {callState.isReceivingCall && (
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <h3 style={{ color: "#fff", marginBottom: "8px" }}>
                  Incoming {callState.callType} call
                </h3>
                <p style={{ color: "#888" }}>
                  {callState.caller?.name} is calling...
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
                  <button
                    style={{ ...styles.controlBtn, background: "#10b981" }}
                    onClick={answerCall}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 16.92c-.012-.039-.08-.12-.145-.182a2.918 2.918 0 0 0-.465-.344 15.447 15.447 0 0 0-1.898-1.029c-.769-.345-1.591-.672-2.426-.961a1.993 1.993 0 0 0-2.394.885l-.667 1.154a13.988 13.988 0 0 1-5.01-5.01l1.154-.667a1.993 1.993 0 0 0 .885-2.394 23.447 23.447 0 0 0-.961-2.426 15.447 15.447 0 0 0-1.029-1.898 2.918 2.918 0 0 0-.344-.465c-.062-.065-.143-.133-.182-.145a1.994 1.994 0 0 0-2.267.485L3.935 5.271a1.993 1.993 0 0 0-.485 1.913c.214.844.529 1.656.93 2.426.398.765.875 1.5 1.414 2.192a20.964 20.964 0 0 0 2.192 2.192c.692.539 1.427 1.016 2.192 1.414.77.401 1.582.716 2.426.93a1.993 1.993 0 0 0 1.913-.485l1.315-1.315a1.994 1.994 0 0 0 .485-2.267z"/>
                    </svg>
                  </button>
                  <button
                    style={{ ...styles.controlBtn, background: "#ef4444" }}
                    onClick={rejectCall}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {(callState.isInCall || callState.isCalling) && (
              <>
                <div style={styles.videoContainer}>
                  {callState.callType === "video" ? (
                    <>
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={styles.video}
                      />
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        style={styles.localVideo}
                      />
                    </>
                  ) : (
                    <>
                      <audio 
                        ref={remoteVideoRef} 
                        autoPlay 
                        playsInline
                        style={{ display: 'none' }}
                      />
                      <audio 
                        ref={localVideoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        style={{ display: 'none' }}
                      />
                      <div style={styles.audioCallView}>
                        <div style={styles.audioAvatar}>
                          {callState.caller ? getInitials(callState.caller.name) : getInitials(currentUser?.name || "U")}
                        </div>
                        <div style={{ color: "#fff", fontSize: "20px", marginTop: "16px" }}>
                          {callState.caller?.name || currentUser?.name || "Audio Call"}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {callState.isCalling && (
                  <p style={{ textAlign: "center", color: "#888", marginBottom: "16px", fontSize: "14px" }}>
                    Calling...
                  </p>
                )}

                {callState.isInCall && (
                  <p style={{ textAlign: "center", color: "#10b981", marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}>
                    ● {formatCallDuration(callDuration)}
                  </p>
                )}

                <div style={styles.callControls}>
                  {callState.isInCall && (
                    <>
                      <button
                        style={{
                          ...styles.controlBtn,
                          background: isMuted ? "#ef4444" : "rgba(255,255,255,0.1)",
                          width: "56px",
                          height: "56px",
                        }}
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {isMuted ? (
                            <>
                              <line x1="1" y1="1" x2="23" y2="23" />
                              <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                              <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                              <line x1="12" y1="19" x2="12" y2="23" />
                              <line x1="8" y1="23" x2="16" y2="23" />
                            </>
                          ) : (
                            <>
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                              <line x1="12" y1="19" x2="12" y2="23" />
                              <line x1="8" y1="23" x2="16" y2="23" />
                            </>
                          )}
                        </svg>
                      </button>
                      
                      {isMobile && (
                        <button
                          style={{
                            ...styles.controlBtn,
                            background: isSpeakerOn ? "#10b981" : "rgba(255,255,255,0.1)",
                            width: "56px",
                            height: "56px",
                          }}
                          onClick={toggleSpeaker}
                          title={isSpeakerOn ? "Speaker on" : "Speaker off"}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            {isSpeakerOn ? (
                              <>
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </>
                            ) : (
                              <>
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                              </>
                            )}
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                  
                  <button
                    style={{ ...styles.controlBtn, background: "#ef4444", width: "56px", height: "56px" }}
                    onClick={endCall}
                    title="End call"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 16.92c-.012-.039-.08-.12-.145-.182a2.918 2.918 0 0 0-.465-.344 15.447 15.447 0 0 0-1.898-1.029c-.769-.345-1.591-.672-2.426-.961a1.993 1.993 0 0 0-2.394.885l-.667 1.154a13.988 13.988 0 0 1-5.01-5.01l1.154-.667a1.993 1.993 0 0 0 .885-2.394 23.447 23.447 0 0 0-.961-2.426 15.447 15.447 0 0 0-1.029-1.898 2.918 2.918 0 0 0-.344-.465c-.062-.065-.143-.133-.182-.145a1.994 1.994 0 0 0-2.267.485L3.935 5.271a1.993 1.993 0 0 0-.485 1.913c.214.844.529 1.656.93 2.426.398.765.875 1.5 1.414 2.192a20.964 20.964 0 0 0 2.192 2.192c.692.539 1.427 1.016 2.192 1.414.77.401 1.582.716 2.426.93a1.993 1.993 0 0 0 1.913-.485l1.315-1.315a1.994 1.994 0 0 0 .485-2.267z" transform="rotate(135 12 12)"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <BottomNav projectId={projectId} />
      
      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <EditTaskModal
          isOpen={showEditModal}
          initialData={editingTask}
          teamMembers={users}
          onSave={handleSaveEditedTask}
          onCancel={() => {
            setShowEditModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
