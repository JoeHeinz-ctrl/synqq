import { useEffect, useRef, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask, reorderTasks, getCurrentUser, updateTask, fetchTeamMembers } from "../services/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import BottomNav from "../components/BottomNav";
import TaskDetailModal from "../components/TaskDetailModal";
import SettingsDropdown from "../components/SettingsDropdown";

const styles: any = {
  container: {
    background: "#1a1a1a",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "70px",
  },

  // Header styles
  topBar: {
    background: "#242424",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    position: "relative",
    zIndex: 50,
  },

  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: "0 0 auto",
  },

  topBarCenter: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: "1 1 auto",
    justifyContent: "center",
  },

  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#1a1a1a",
    color: "#b3b3b3",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
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
    whiteSpace: "nowrap",
  },

  greeting: {
    fontSize: "14px",
    color: "#fff",
    fontWeight: "500",
  },

  projectTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: "-0.3px",
  },

  taskCount: {
    fontSize: "12px",
    color: "#888",
    marginLeft: "8px",
  },

  chatBtn: {
    padding: "8px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(11, 125, 224, 0.3)",
    background: "rgba(11, 125, 224, 0.1)",
    color: "#0b7de0",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  // Main content
  mainContent: {
    flex: 1,
    padding: "20px 12px 12px 12px", // Added top padding to prevent column header cutoff
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  shortcuts: {
    fontSize: "11px",
    color: "#555",
    marginBottom: "12px",
    padding: "6px 10px",
    background: "#242424",
    borderRadius: "8px",
    display: "inline-block",
    alignSelf: "flex-start",
  },

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
    flex: 1,
    overflow: "auto",
  },

  column: {
    background: "#242424",
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    minHeight: "300px",
    maxHeight: "calc(100vh - 220px)",
    transition: "all 0.25s ease",
    border: "1px solid rgba(255,255,255,0.05)",
    position: "relative",
    zIndex: 1,
  },

  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },

  columnTitle: {
    fontWeight: "600",
    fontSize: "13px",
    letterSpacing: "0.5px",
    color: "#b3b3b3",
    textTransform: "uppercase",
  },

  columnCount: {
    background: "#2a2a2a",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#0b7de0",
  },

  taskList: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "4px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },

  card: {
    background: "#2a2a2a",
    padding: "12px",
    borderRadius: "10px",
    cursor: "grab",
    transition: "all 0.2s ease",
    color: "#ffffff",
    fontSize: "13px",
    userSelect: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    border: "1px solid rgba(255,255,255,0.03)",
  },

  addBtn: {
    background: "transparent",
    border: "none",
    color: "#b3b3b3",
    fontSize: "16px",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },

  taskDeleteBtn: {
    background: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px",
    transition: "all 0.2s ease",
  },

  taskEditBtn: {
    background: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px",
    transition: "all 0.2s ease",
  },

  dropIndicator: {
    height: "2px",
    borderRadius: "2px",
    background: "#0b7de0",
    boxShadow: "0 0 6px rgba(11,125,224,0.6)",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#666666",
    fontSize: "13px",
    textAlign: "center",
    flex: 1,
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
    opacity: 0.3,
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalContent: {
    background: "#242424",
    padding: "28px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  modalTitle: { 
    fontSize: "18px", 
    fontWeight: "600", 
    color: "#fff", 
    margin: 0 
  },

  modalText: { 
    fontSize: "14px", 
    color: "#b3b3b3", 
    margin: 0, 
    lineHeight: "1.5" 
  },

  modalButtons: { 
    display: "flex", 
    justifyContent: "flex-end", 
    gap: "10px", 
    flexWrap: "wrap" 
  },

  modalInput: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#1a1a1a",
    color: "#ffffff",
    outline: "none",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  btnPrimary: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#0b7de0",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },

  btnDanger: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#ff4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },

  btnSecondary: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#b3b3b3",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    transition: "all 0.2s ease",
  },
};

export default function Dashboard() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const colors = theme.getThemeColors();
  
  const [project, setProject] = useState<any>(location.state?.project || null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);

  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createPromptCol, setCreatePromptCol] = useState<string | null>(null);
  const [createTaskTitle, setCreateTaskTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // Load project if missing
  useEffect(() => {
    if (!project && projectId) {
      setProject({ id: parseInt(projectId), title: "Project " + projectId });
    }
  }, [projectId, project]);

  // Load tasks
  useEffect(() => {
    if (!projectId) return;
    fetchTasks(parseInt(projectId)).then(setTasks).catch(() => setTasks([]));
  }, [projectId]);

  // Clear selection if task deleted
  useEffect(() => {
    if (selectedTaskId !== null && !tasks.find((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(null);
    }
  }, [tasks, selectedTaskId]);

  // Load user and greeting
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;
        setCurrentUser(user);

        const hour = new Date().getHours();
        let bucket = "morning";
        if (hour >= 12 && hour < 17) bucket = "afternoon";
        else if (hour >= 17 && hour < 22) bucket = "evening";
        else if (hour >= 22 || hour < 5) bucket = "night";

        const variants: Record<string, string[]> = {
          morning: ["Good morning", "Welcome back", "Great to see you this morning"],
          afternoon: ["Good afternoon", "Welcome back", "Hope your day's going well"],
          evening: ["Good evening", "Welcome back", "Nice to see you this evening"],
          night: ["Working late?", "Welcome back", "Good to see you"]
        };

        const rawVariant = Number(localStorage.getItem("greeting_variant") ?? Math.floor(Math.random() * 100));
        const list = variants[bucket] || variants.morning;
        const pick = list[rawVariant % list.length];
        const firstName = (user?.name || "").split(" ")[0] || "there";
        setGreeting(`${pick} ${firstName}`);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load team members if project has a team
  useEffect(() => {
    if (!project?.team_id) {
      setTeamMembers(currentUser ? [{ id: currentUser.id, name: currentUser.name }] : []);
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const members = await fetchTeamMembers(project.team_id);
        if (mounted) setTeamMembers(members);
      } catch {
        if (mounted) setTeamMembers(currentUser ? [{ id: currentUser.id, name: currentUser.name }] : []);
      }
    })();
    return () => { mounted = false; };
  }, [project?.team_id, currentUser]);

  const promptCreateTask = (status: string) => { 
    setCreatePromptCol(status); 
    setCreateTaskTitle(""); 
  };

  const confirmCreateTask = async () => {
    if (!createPromptCol || !projectId) return;
    const title = createTaskTitle.trim();
    if (!title) { setCreatePromptCol(null); return; }
    try {
      const created = await createTask(title, parseInt(projectId), createPromptCol.toLowerCase());
      setTasks((prev) => [...prev, created]);
      setCreatePromptCol(null);
    } catch (err: any) { 
      console.error("Task creation error:", err);
      setAlertMessage(err.message || "Failed to create task"); 
    }
  };

  const onClickDeleteTask = (e: React.MouseEvent, taskId: number) => { 
    e.stopPropagation(); 
    setDeleteConfirmId(taskId); 
  };

  const confirmDeleteTask = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteTask(deleteConfirmId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    } catch { 
      setAlertMessage("Failed to delete task"); 
    } finally { 
      setDeleteConfirmId(null); 
    }
  };


  const selectTask = (taskId: number | null) => {
    setSelectedTaskId(taskId);
  };


  const markSelectedDone = async () => {
    if (selectedTaskId === null) return;
    const t = tasks.find((x) => x.id === selectedTaskId);
    if (!t || normalizeStatus(t.status) === "done") return;
    try {
      const updated = await moveTask(t.id, "done");
      setTasks((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch {
      setAlertMessage("Failed to mark task done");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement).isContentEditable ||
        deleteConfirmId !== null ||
        createPromptCol !== null ||
        alertMessage !== null
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "n") {
        const col = selectedTaskId
          ? normalizeStatus(tasks.find((x) => x.id === selectedTaskId)?.status || "")
          : "todo";
        promptCreateTask(col.toUpperCase());
      } else if (key === "e") {
        const t = selectedTaskId !== null && tasks.find((x) => x.id === selectedTaskId);
        if (t) {
          setSelectedTaskId(t.id);
          setShowTaskDetail(true);
        }
      } else if (key === "d") {
        markSelectedDone();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedTaskId, tasks]);

  // Drag and drop handlers
  const onDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    // Fix ghost clone: use a transparent 1x1 image as drag image
    const ghost = document.createElement("div");
    ghost.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
    setDragOverTaskId(null);
  };

  const onDragOverTask = (e: React.DragEvent, hoveredTask: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTask || hoveredTask.id === draggedTask.id) return;
    setDragOverTaskId(hoveredTask.id);
  };

  const onDragOverColumn = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const onDragLeaveColumn = () => {
    setDragOverCol(null);
  };

  const onDropOnTask = async (e: React.DragEvent, targetTask: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTask || draggedTask.id === targetTask.id) {
      setDraggedTask(null);
      setDragOverTaskId(null);
      return;
    }

    const current = tasksRef.current;
    const sameCol = normalizeStatus(draggedTask.status) === normalizeStatus(targetTask.status);

    if (sameCol) {
      const colTasks = current.filter((t) => normalizeStatus(t.status) === normalizeStatus(targetTask.status));
      const fromIdx = colTasks.findIndex((t) => t.id === draggedTask.id);
      const toIdx = colTasks.findIndex((t) => t.id === targetTask.id);

      const reordered = [...colTasks];
      reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, draggedTask);

      const otherTasks = current.filter((t) => normalizeStatus(t.status) !== normalizeStatus(targetTask.status));
      setTasks([...otherTasks, ...reordered]);

      try { 
        await reorderTasks(reordered.map((t) => t.id)); 
      } catch { 
        if (projectId) fetchTasks(parseInt(projectId)).then(setTasks); 
      }
    } else {
      try {
        const updated = await moveTask(draggedTask.id, normalizeStatus(targetTask.status));
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } catch { 
        setAlertMessage("Failed to move task"); 
      }
    }

    setDraggedTask(null);
    setDragOverCol(null);
    setDragOverTaskId(null);
  };

  const onDropColumn = async (col: string) => {
    if (!draggedTask) return;
    if (normalizeStatus(draggedTask.status) === col) {
      setDraggedTask(null);
      setDragOverCol(null);
      setDragOverTaskId(null);
      return;
    }
    try {
      const updated = await moveTask(draggedTask.id, col);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch { 
      setAlertMessage("Failed to move task"); 
    } finally {
      setDraggedTask(null);
      setDragOverCol(null);
      setDragOverTaskId(null);
    }
  };

  const normalizeStatus = (s: string) => {
    if (!s) return "todo";
    s = s.toLowerCase();
    if (s.includes("doing")) return "doing";
    if (s.includes("done")) return "done";
    return "todo";
  };

  const getColumnConfig = (status: string) => {
    const configs: any = {
      todo: { emoji: "📋", color: "#0b7de0" },
      doing: { emoji: "⚡", color: "#f59e0b" },
      done: { emoji: "✓", color: "#10b981" },
    };
    return configs[status] || configs.todo;
  };

  const getColumnTasks = (status: string) =>
    tasks.filter((t) => normalizeStatus(t.status) === status);

  const renderTasks = (status: string) => {
    const colTasks = getColumnTasks(status);

    if (colTasks.length === 0) {
      return (
        <div style={styles.emptyState} className="empty-state">
          <div style={styles.emptyIcon}>{getColumnConfig(status).emoji}</div>
          <div>No tasks yet</div>
        </div>
      );
    }

    return colTasks.map((t) => (
      <div key={t.id}>
        {dragOverTaskId === t.id && draggedTask?.id !== t.id && (
          <div style={styles.dropIndicator} className="drop-indicator" />
        )}

        <div
          className="task-card"
          style={{
            ...styles.card,
            background: colors.surface,
            color: colors.text,
            border: `1px solid ${colors.border}`,
            opacity: draggedTask?.id === t.id ? 0.4 : 1,
            outline: selectedTaskId === t.id ? `2px solid ${colors.primary}` : "none",
          }}
          draggable
          onClick={(e) => { e.stopPropagation(); selectTask(t.id); }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setSelectedTaskId(t.id);
            setShowTaskDetail(true);
          }}
          onDragStart={(e) => onDragStart(e, t)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => onDragOverTask(e, t)}
          onDrop={(e) => onDropOnTask(e, t)}
        >
          <span style={{ flex: 1, paddingRight: "8px" }}>{t.title}</span>
          <div style={{ display: "flex", gap: "2px" }}>
            <button
              className="delete-btn"
              style={styles.taskDeleteBtn}
              title="Delete task"
              onClick={(e) => onClickDeleteTask(e, t.id)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6b6b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; }}
            >🗑️</button>
          </div>
        </div>

        {/* Show detail panel if this task is selected */}
        {selectedTaskId === t.id && showTaskDetail && (
          <TaskDetailModal
            task={t}
            onClose={() => {
              setShowTaskDetail(false);
              setSelectedTaskId(null);
            }}
            onUpdate={async (taskId, updates) => {
              try {
                // Save all updates to backend
                await updateTask(taskId, updates);
                
                // Refresh tasks
                if (projectId) {
                  const updated = await fetchTasks(parseInt(projectId));
                  setTasks(updated);
                }
              } catch (err) {
                console.error("Failed to update task:", err);
              }
            }}
            teamMembers={teamMembers}
          />
        )}
      </div>
    ));
  };

  return (
    <div style={{...styles.container, background: colors.background}} onClick={() => selectTask(null)}>
      <style>{`
        *::-webkit-scrollbar { width: 6px; height: 6px; }
        *::-webkit-scrollbar-track { background: ${colors.background}; }
        *::-webkit-scrollbar-thumb { background: ${colors.surfaceHover}; border-radius: 3px; }
        *::-webkit-scrollbar-thumb:hover { background: ${colors.textSecondary}; }
        
        /* Hide scrollbar in task lists */
        .task-list::-webkit-scrollbar { display: none; }

        /* ─────────────────── ANIMATIONS ─────────────────── */
        
        /* 1. Column Hover Elevation */
        .board-grid > div {
          animation: columnStaggerIn 0.5s ease-out backwards;
        }
        .board-grid > div:nth-child(1) { animation-delay: 0ms; }
        .board-grid > div:nth-child(2) { animation-delay: 100ms; }
        .board-grid > div:nth-child(3) { animation-delay: 200ms; }
        
        @keyframes columnStaggerIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .board-grid > div:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          z-index: 10;
        }
        
        /* 2. Task Card Hover Animation */
        .task-card {
          transition: all 0.2s ease;
        }
        
        .task-card:hover {
          transform: scale(1.02);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 6px 15px rgba(0,0,0,0.3);
          border-color: rgba(255,255,255,0.1);
        }
        
        /* 3. Task Card Slide In Animation */
        .task-card {
          animation: taskSlideIn 0.25s ease-out;
        }
        
        @keyframes taskSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* 4. Column Header Pulse Animation for DOING status */
        .column-header-doing {
          animation: headerPulse 2s infinite;
        }
        
        @keyframes headerPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        /* 5. Column Counter Pop Animation */
        .column-count {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .column-count.pop {
          animation: countPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes countPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        /* 6. Add Button Hover Glow */
        .add-btn:hover {
          box-shadow: 0 0 12px ${colors.primaryLight};
        }
        
        /* 7. Chat Button Glow */
        .chat-btn-animated:hover {
          box-shadow: 0 0 10px ${colors.primaryLight};
        }
        
        /* 8. Task Completion Checkmark Animation */
        .task-done-check {
          animation: checkmarkPulse 0.4s ease-out;
        }
        
        @keyframes checkmarkPulse {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        /* 9. Empty State Fade In */
        .empty-state {
          animation: fadeInEmpty 0.3s ease-out;
        }
        
        @keyframes fadeInEmpty {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* 10. Modal Fade In */
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(4px);
          }
        }
        
        /* 11. Smooth Scroll */
        .task-list {
          scroll-behavior: smooth;
        }
        
        /* 12. Drag Physics - Task being dragged */
        .task-card.dragging {
          animation: dragLift 0.2s ease-out forwards;
        }
        
        @keyframes dragLift {
          from {
            transform: scale(1) rotate(0deg);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          to {
            transform: scale(1.05) rotate(2deg);
            box-shadow: 0 12px 24px rgba(0,0,0,0.4);
          }
        }
        
        /* 13. Drop Indicator Pulse */
        .drop-indicator {
          animation: dropPulse 1.5s ease-in-out infinite;
        }
        
        @keyframes dropPulse {
          0%, 100% {
            box-shadow: 0 0 6px rgba(11,125,224,0.6);
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 12px rgba(11,125,224,0.8);
            opacity: 0.8;
          }
        }
        
        /* 14. Keyboard Shortcut Highlight */
        kbd {
          transition: all 0.2s ease;
        }
        
        .shortcuts-badge:hover kbd {
          background: #3a3a3a;
          box-shadow: 0 0 8px rgba(11,125,224,0.3);
          transform: scale(1.05);
        }
        
        /* 15. Glassmorphism Effect for Cards */
        .task-card {
          backdrop-filter: blur(2px);
          background: rgba(42, 42, 42, 0.7);
        }
        
        .task-card:hover {
          backdrop-filter: blur(4px);
          background: rgba(255, 255, 255, 0.08);
        }

        .task-card .delete-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .task-card:hover .delete-btn {
          opacity: 1;
        }
        
        input::placeholder { color: #666666; }
        kbd { 
          background: #2a2a2a; 
          padding: 2px 6px; 
          border-radius: 4px; 
          font-size: 10px; 
          font-family: monospace;
          border: 1px solid #3a3a3a;
        }
        @media (max-width: 768px) {
          .top-bar { 
            flex-direction: column; 
            align-items: stretch !important; 
            padding: 10px 12px !important;
            gap: 8px !important;
          }
          .top-bar-left, .top-bar-right {
            justify-content: space-between;
          }
          .top-bar-center { 
            order: -1; 
            margin-bottom: 8px; 
          }
          .board-grid { 
            grid-template-columns: 1fr !important; 
            gap: 10px !important;
          }
          .shortcuts-badge {
            font-size: 10px !important;
            padding: 5px 8px !important;
            margin-bottom: 8px !important;
          }
        }
      `}</style>

      {/* Top Bar with Header Info */}
      <div style={{...styles.topBar, background: colors.surface, borderBottom: `1px solid ${colors.border}`}} className="top-bar">
        <div style={styles.topBarLeft}>
          <button 
            style={styles.backBtn} 
            onClick={() => navigate('/board')}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2c2c2c"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#b3b3b3"; }}
          >
            ← Back
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={styles.projectTitle}>{project ? project.title : "Project Board"}</div>
              <div style={styles.taskCount}>· {tasks.length} tasks</div>
            </div>
            {teamMembers.length > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                {teamMembers.map((m: any, i: number) => (
                  <span key={m.id} style={{ fontSize: "11px", color: "#666", fontWeight: "500" }}>
                    {m.name}{i < teamMembers.length - 1 ? "," : ""}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.topBarCenter} className="top-bar-center">
          {greeting && <div style={styles.greeting}>{greeting}</div>}
        </div>

        <div style={styles.topBarRight}>
          {/* Member avatars strip */}
          {teamMembers.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {teamMembers.slice(0, 5).map((m, i) => (
                <div
                  key={m.id}
                  title={m.name}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: `hsl(${(m.id * 67) % 360}, 60%, 45%)`,
                    border: "2px solid #1a1a1a",
                    marginLeft: i === 0 ? "0" : "-8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#fff",
                    cursor: "default",
                    zIndex: teamMembers.slice(0, 5).length - i,
                    position: "relative",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {m.name[0].toUpperCase()}
                </div>
              ))}
              {teamMembers.length > 5 && (
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "#333",
                  border: "2px solid #1a1a1a",
                  marginLeft: "-8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#888",
                  position: "relative",
                }}>
                  +{teamMembers.length - 5}
                </div>
              )}
            </div>
          )}
          <button 
            style={styles.chatBtn} 
            className="chat-btn-animated"
            onClick={() => projectId && navigate(`/chat/${projectId}`)}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(11,125,224,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(11,125,224,0.1)"; }}
          >
            💬 Chat
          </button>
          
          {/* Settings Dropdown */}
          <SettingsDropdown />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.shortcuts} className="shortcuts-badge">
          <kbd>N</kbd> new task · <kbd>E</kbd> edit · <kbd>D</kbd> mark done
        </div>

        <div style={styles.board} className="board-grid">
          {(["todo", "doing", "done"] as const).map((col) => (
            <div
              key={col}
              style={{
                ...styles.column,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                outline: dragOverCol === col ? `2px solid ${colors.primary}` : "none",
              }}
              className={`column-${col}`}
              onDragOver={(e) => onDragOverColumn(e, col)}
              onDragLeave={onDragLeaveColumn}
              onDrop={() => onDropColumn(col)}
            >
              <div style={styles.columnHeader} className={col === "doing" ? "column-header-doing" : ""}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px" }}>{getColumnConfig(col).emoji}</span>
                  <div style={styles.columnTitle}>{col}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={styles.columnCount} className="column-count">{getColumnTasks(col).length}</div>
                  <button
                    style={styles.addBtn}
                    className="add-btn"
                    title={`Add to ${col.toUpperCase()}`}
                    onClick={() => promptCreateTask(col.toUpperCase())}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#3a3a3a"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "transparent"; }}
                  >+</button>
                </div>
              </div>
              <div style={styles.taskList} className="task-list">
                {renderTasks(col)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirmId !== null && (
        <div style={styles.modalOverlay} className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Delete Task</h3>
            <p style={styles.modalText}>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.btnSecondary} 
                onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >
                Cancel
              </button>
              <button 
                style={styles.btnDanger} 
                onClick={confirmDeleteTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Create Modal */}
      {createPromptCol !== null && (
        <div style={styles.modalOverlay} className="modal-overlay" onClick={() => setCreatePromptCol(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>New Task ({createPromptCol})</h3>
            <input 
              style={styles.modalInput} 
              autoFocus 
              placeholder="What needs to be done?"
              value={createTaskTitle}
              onChange={(e) => setCreateTaskTitle(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === "Enter") confirmCreateTask(); 
                if (e.key === "Escape") setCreatePromptCol(null); 
              }} 
            />
            <div style={styles.modalButtons}>
              <button 
                style={styles.btnSecondary} 
                onClick={() => setCreatePromptCol(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}
              >
                Cancel
              </button>
              <button 
                style={styles.btnPrimary} 
                onClick={confirmCreateTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage !== null && (
        <div style={styles.modalOverlay} className="modal-overlay" onClick={() => setAlertMessage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Notice</h3>
            <p style={styles.modalText}>{alertMessage}</p>
            <div style={styles.modalButtons}>
              <button 
                style={styles.btnPrimary} 
                onClick={() => setAlertMessage(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Navigation */}
      <BottomNav projectId={projectId} />
    </div>
  );
}
