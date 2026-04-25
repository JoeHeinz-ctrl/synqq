import { useEffect, useRef, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask, reorderTasks, getCurrentUser, updateTask, fetchTeamMembers, fetchProject } from "../services/api";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import BottomNav from "../components/BottomNav";
import TaskDetailModal from "../components/TaskDetailModal";
import SettingsDropdown from "../components/SettingsDropdown";
import { SoftListView } from "../components/SoftListView";
import { AISidePanel } from "../components/AISidePanel";

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
  topBar: (colors: any, isDark: boolean) => ({
    background: colors.headerBg,
    borderBottom: `1px solid ${colors.border}`,
    padding: "12px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexShrink: 0,
    boxShadow: isDark 
      ? "0 2px 8px rgba(0,0,0,0.4)" 
      : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  }),

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    justifyContent: "flex-start",
  },

  headerCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "flex-end",
  },

  backBtn: (colors: any) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  }),

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

  greeting: (colors: any) => ({
    fontSize: "15px",
    color: colors.text,
    fontWeight: "600",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    letterSpacing: "-0.2px",
  }),

  projectTitle: (colors: any) => ({
    fontSize: "16px",
    fontWeight: "700",
    color: colors.text,
    letterSpacing: "-0.3px",
    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryHover})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    whiteSpace: "nowrap",
  }),

  projectMeta: (colors: any) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    color: colors.textSecondary,
    fontWeight: "500",
  }),

  metaBadge: (colors: any) => ({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "10px",
    background: colors.primaryLight,
    color: colors.primary,
    fontSize: "10px",
    fontWeight: "600",
  }),

  taskCount: (colors: any) => ({
    fontSize: "12px",
    color: colors.textSecondary,
    marginLeft: "8px",
  }),

  chatBtn: (colors: any) => ({
    padding: "8px 16px",
    borderRadius: "10px",
    border: `1px solid ${colors.primary}40`,
    background: colors.primaryLight,
    color: colors.primary,
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }),

  // Main content
  mainContent: {
    flex: 1,
    padding: "24px 16px 12px 16px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    marginTop: "0",
  },

  shortcuts: (colors: any) => ({
    fontSize: "10px",
    color: colors.textSecondary,
    opacity: 0.8,
    display: "flex",
    gap: "6px",
    alignItems: "center",
    whiteSpace: "nowrap",
    fontWeight: "500",
  }),

  board: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "12px",
    flex: 1,
    overflow: "auto",
    paddingTop: "4px",
  },

  column: (colors: any, isDark: boolean) => ({
    background: colors.surface,
    padding: "12px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    minHeight: "300px",
    maxHeight: "calc(100vh - 220px)",
    transition: "all 0.25s ease",
    border: `1px solid ${colors.border}`,
    position: "relative",
    overflow: "hidden",
    boxShadow: isDark 
      ? "0 2px 8px rgba(0,0,0,0.3)" 
      : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  }),

  columnHighlight: {
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    pointerEvents: "none",
    opacity: 0,
    transition: "opacity 120ms ease",
    boxShadow: "inset 0 0 0 1px rgba(99,102,241,0.4)",
    background: "rgba(99,102,241,0.04)",
    zIndex: 1,
  },

  columnHighlightActive: {
    opacity: 1,
  },

  columnHeaderDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.05)",
    margin: "0 -12px 12px -12px",
    position: "relative",
    zIndex: 2,
  },

  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    position: "relative",
    zIndex: 2,
  },

  columnTitle: (colors: any) => ({
    fontWeight: "600",
    fontSize: "13px",
    letterSpacing: "0.5px",
    color: colors.textSecondary,
    textTransform: "uppercase",
  }),

  columnCount: (colors: any) => ({
    background: colors.primaryLight,
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    color: colors.primary,
  }),

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
    position: "relative",
    zIndex: 2,
  },

  card: (colors: any, isDark: boolean) => ({
    background: colors.cardBg,
    padding: "12px",
    borderRadius: "12px",
    cursor: "grab",
    transition: "transform 120ms ease, box-shadow 120ms ease",
    color: colors.text,
    fontSize: "13px",
    userSelect: "none",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    border: `1px solid ${colors.border}`,
    position: "relative",
    zIndex: 3,
    boxShadow: isDark 
      ? "0 1px 3px rgba(0,0,0,0.3)" 
      : "0 1px 2px rgba(0,0,0,0.05)",
  }),

  cardDragging: (isDark: boolean) => ({
    transform: "scale(1.02)",
    boxShadow: isDark 
      ? "0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)" 
      : "0 20px 40px rgba(0,0,0,0.2)",
    cursor: "grabbing",
    opacity: 0.95,
    zIndex: 999,
  }),

  dragPlaceholder: {
    height: "2px",
    background: "#6366f1",
    borderRadius: "2px",
    boxShadow: "0 0 8px rgba(99,102,241,0.6)",
    margin: "6px 0",
    transition: "all 150ms ease",
    animation: "insertionLineFadeIn 150ms ease",
  },

  inlineInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(99,102,241,0.3)",
    background: "rgba(255,255,255,0.02)",
    color: "#ffffff",
    fontSize: "13px",
    outline: "none",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
    transition: "all 120ms ease",
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
    fontSize: "12px",
    textAlign: "center",
    flex: 1,
  },

  emptyIcon: {
    fontSize: "32px",
    marginBottom: "8px",
    opacity: 0.25,
  },

  emptyText: {
    fontSize: "12px",
    color: "#666",
    fontWeight: "400",
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
  const theme = useTheme();
  const colors = theme.getThemeColors();
  const isDark = theme.mode === 'dark';
  
  const [project, setProject] = useState<any>(location.state?.project || null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);

  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);
  const [inlineCreateCol, setInlineCreateCol] = useState<string | null>(null);
  const [inlineTaskTitle, setInlineTaskTitle] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createPromptCol, setCreatePromptCol] = useState<string | null>(null);
  const [createTaskTitle, setCreateTaskTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  
  const [viewMode, setViewMode] = useState<'board' | 'list'>(() => {
    const saved = localStorage.getItem('synq:viewMode');
    // Default to list view on mobile, board on desktop
    const isMobile = window.innerWidth <= 768;
    const defaultMode = isMobile ? 'list' : 'board';
    return (saved === 'list' || saved === 'board' ? saved : defaultMode) as 'board' | 'list';
  });
  const [favoriteTaskIds, setFavoriteTaskIds] = useState<Set<number>>(new Set());
  const [showAIPanel, setShowAIPanel] = useState(false);

  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  // Persist viewMode to localStorage
  useEffect(() => {
    localStorage.setItem('synq:viewMode', viewMode);
  }, [viewMode]);

  // Load project if missing
  useEffect(() => {
    if (!project && projectId) {
      // Fetch actual project data instead of using fallback
      fetchProject(parseInt(projectId))
        .then(setProject)
        .catch(() => {
          // Fallback only if fetch fails
          setProject({ id: parseInt(projectId), title: "Project " + projectId });
        });
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
    setInlineCreateCol(status);
    setInlineTaskTitle("");
  };

  const confirmInlineCreate = async () => {
    if (!inlineCreateCol || !projectId) return;
    const title = inlineTaskTitle.trim();
    if (!title) { 
      setInlineCreateCol(null); 
      setInlineTaskTitle("");
      return; 
    }
    try {
      const created = await createTask(title, parseInt(projectId), inlineCreateCol.toLowerCase());
      setTasks((prev) => [...prev, created]);
      setInlineTaskTitle("");
      // Keep inline input open for quick task creation
    } catch (err: any) { 
      console.error("Task creation error:", err);
      setAlertMessage(err.message || "Failed to create task"); 
      setInlineCreateCol(null);
    }
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
      
      // No AI keyboard shortcuts - use toggle button instead
      
      // Existing shortcuts
      if (key === "n") {
        const col = selectedTaskId
          ? normalizeStatus(tasks.find((x) => x.id === selectedTaskId)?.status || "")
          : "todo";
        promptCreateTask(col);
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
  }, [selectedTaskId, tasks, deleteConfirmId, createPromptCol, alertMessage]);

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
      todo: { 
        icon: "○", 
        color: "#0b7de0",
        title: "Todo",
        emptyText: "Drag tasks here to get started"
      },
      doing: { 
        icon: "◐", 
        color: "#f59e0b",
        title: "In Progress",
        emptyText: "Drag tasks here to start working"
      },
      done: { 
        icon: "●", 
        color: "#10b981",
        title: "Done",
        emptyText: "Completed tasks will appear here"
      },
    };
    return configs[status] || configs.todo;
  };

  const getColumnTasks = (status: string) =>
    tasks.filter((t) => normalizeStatus(t.status) === status);

  const renderTasks = (status: string) => {
    const colTasks = getColumnTasks(status);
    const config = getColumnConfig(status);

    if (colTasks.length === 0 && inlineCreateCol !== status) {
      return (
        <div style={styles.emptyState} className="empty-state">
          <div style={styles.emptyIcon}>{config.icon}</div>
          <div style={styles.emptyText}>{config.emptyText}</div>
        </div>
      );
    }

    return (
      <>
        {colTasks.map((t) => (
          <div key={t.id}>
            {/* Insertion line indicator */}
            {dragOverTaskId === t.id && draggedTask?.id !== t.id && (
              <div style={styles.dragPlaceholder} className="insertion-line" />
            )}

            <div
              className={`task-card ${draggedTask?.id === t.id ? 'dragging' : ''}`}
              style={{
                ...styles.card(colors, isDark),
                ...(draggedTask?.id === t.id ? styles.cardDragging(isDark) : {}),
                opacity: draggedTask?.id === t.id ? 0.3 : 1,
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
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Don't render inline modal here - use global modal instead */}
          </div>
        ))}

        {/* Inline task creation */}
        {inlineCreateCol === status && (
          <div style={{ animation: "taskSlideIn 150ms ease-out" }}>
            <input
              autoFocus
              style={styles.inlineInput}
              placeholder="Write a task..."
              value={inlineTaskTitle}
              onChange={(e) => setInlineTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmInlineCreate();
                if (e.key === "Escape") {
                  setInlineCreateCol(null);
                  setInlineTaskTitle("");
                }
              }}
              onBlur={() => {
                if (!inlineTaskTitle.trim()) {
                  setInlineCreateCol(null);
                }
              }}
            />
          </div>
        )}
      </>
    );
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

        /* ─────────────────── EPIC VISUAL ENHANCEMENTS ─────────────────── */
        
        /* Smooth page transitions */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Enhanced button interactions */
        button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        button:active {
          transform: scale(0.98) !important;
        }
        
        /* Epic card hover effects */
        .task-card {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
          will-change: transform, box-shadow;
        }
        
        .task-card:hover {
          transform: translateY(-1px) !important;
          box-shadow: ${isDark 
            ? '0 4px 15px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)' 
            : '0 3px 12px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)'} !important;
        }
        
        /* Enhanced column hover effects */
        .board-grid > div {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          will-change: transform, box-shadow;
          position: relative;
        }
        
        .board-grid > div:hover {
          transform: translateY(-2px) !important;
          box-shadow: ${isDark 
            ? '0 12px 30px rgba(0,0,0,0.5), 0 6px 15px rgba(0,0,0,0.3)' 
            : '0 8px 25px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)'} !important;
          z-index: 5 !important;
        }
        
        /* Glowing primary buttons */
        .chat-btn-animated {
          position: relative;
          overflow: hidden;
        }
        
        .chat-btn-animated::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .chat-btn-animated:hover::before {
          left: 100%;
        }
        
        /* Enhanced view toggle buttons */
        .view-toggle-btn {
          position: relative;
          overflow: hidden;
        }
        
        .view-toggle-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }
        
        .view-toggle-btn:hover::after {
          width: 100px;
          height: 100px;
        }
        
        /* Floating animation for empty states */
        .empty-state svg {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Pulse animation for active elements */
        .pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 ${colors.primary}40; }
          70% { box-shadow: 0 0 0 10px ${colors.primary}00; }
          100% { box-shadow: 0 0 0 0 ${colors.primary}00; }
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${colors.background};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 4px;
          transition: background 0.2s;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${colors.textSecondary};
        }
        
        /* Enhanced modal animations */
        .modal-overlay {
          animation: modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }
        
        .modal-content {
          animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Proper vertical layout structure */
        .top-bar {
          flex-shrink: 0;
        }
        
        /* Board container below header */
        .board-grid {
          isolation: isolate;
        }

        /* ─────────────────── DRAG & DROP IMPROVEMENTS ─────────────────── */
        
        /* Column highlight layer animation */
        .column-highlight {
          animation: highlightFadeIn 120ms ease-out;
          z-index: 1;
        }
        
        @keyframes highlightFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        /* Insertion line animation */
        @keyframes insertionLineFadeIn {
          from {
            opacity: 0;
            transform: scaleX(0.8);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        /* Task card improvements */
        .task-card {
          transition: transform 120ms ease, box-shadow 120ms ease;
          position: relative;
          z-index: 3;
          will-change: transform;
        }
        
        .task-card:hover {
          border-color: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'} !important;
          background: ${colors.surfaceHover} !important;
          transform: translateY(-1px);
          z-index: 4;
          box-shadow: ${isDark 
            ? '0 4px 12px rgba(0,0,0,0.4)' 
            : '0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08)'} !important;
        }
        
        .task-card.dragging {
          transform: scale(1.02) !important;
          box-shadow: ${isDark ? '0 20px 40px rgba(0,0,0,0.45)' : '0 20px 40px rgba(0,0,0,0.15)'} !important;
          cursor: grabbing !important;
          opacity: 0.95 !important;
          z-index: 999 !important;
          will-change: transform;
        }
        
        /* Z-index layering for proper stacking */
        .board-grid > div {
          isolation: isolate;
        }
        
        /* Smooth task reordering */
        .task-list > div {
          transition: transform 150ms ease;
        }

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
          box-shadow: ${isDark 
            ? '0 12px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)' 
            : '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)'};
          border-color: ${isDark ? 'rgba(255,255,255,0.18)' : colors.border};
          z-index: 10;
        }
        
        /* 3. Task Card Slide In Animation */
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
        .add-btn {
          transition: all 120ms ease;
        }
        
        .add-btn:hover {
          box-shadow: 0 0 12px ${colors.primaryLight};
        }
        
        /* 7. Chat Button Glow */
        .chat-btn-animated:hover {
          box-shadow: 0 0 10px ${colors.primaryLight};
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
        .shortcuts-badge {
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        
        .shortcuts-badge:hover {
          opacity: 0.9;
        }

        .task-card .delete-btn {
          opacity: 0;
          transition: opacity 120ms ease;
        }
        .task-card:hover .delete-btn {
          opacity: 1;
        }
        
        input::placeholder { color: #666666; }
        
        kbd {
          background: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
          padding: 2px 5px; 
          border-radius: 3px; 
          font-size: 9px; 
          font-family: monospace;
          border: 1px solid ${colors.border};
        }
        
        @media (max-width: 768px) {
          .top-bar { 
            flex-direction: column; 
            align-items: stretch !important; 
            padding: 12px 16px !important;
            gap: 12px !important;
          }
          .header-left {
            order: 1;
            flex-wrap: wrap;
            gap: 8px !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .header-center { 
            order: 0;
            flex-wrap: wrap;
            justify-content: center !important;
            margin-bottom: 4px;
          }
          .header-right {
            order: 2;
            justify-content: center !important;
            flex-wrap: wrap;
            gap: 8px !important;
            align-items: center !important;
          }
          .board-grid { 
            grid-template-columns: 1fr !important; 
            gap: 10px !important;
          }
          
          /* Better mobile spacing for project info */
          .project-meta {
            flex-wrap: wrap !important;
            gap: 4px !important;
            justify-content: center !important;
          }
          
          /* Center view toggle for mobile */
          .view-toggle-container {
            justify-content: center !important;
            width: 100% !important;
          }
          
          /* AI panel full screen on mobile */
          .ai-panel-mobile {
            width: 100vw !important;
            left: 0 !important;
          }
        }
      `}</style>

      {/* Compact Header */}
      <div style={styles.topBar(colors, isDark)} className="top-bar">
        {/* Left Section - Back Button + Project Info */}
        <div style={styles.headerLeft} className="header-left">
          <button 
            style={styles.backBtn(colors)} 
            onClick={() => navigate('/board')}
            onMouseEnter={(e) => { e.currentTarget.style.background = colors.surfaceHover; e.currentTarget.style.color = colors.text; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.color = colors.textSecondary; }}
          >
            ← Back
          </button>
          
          <div style={styles.projectTitle(colors)}>
            {project ? project.title : "Loading..."}
          </div>
          
          <div style={styles.projectMeta(colors)} className="project-meta">
            <div style={styles.metaBadge(colors)}>
              <span>{tasks.length} tasks</span>
            </div>
            <div style={styles.metaBadge(colors)}>
              <span>{teamMembers.map(m => m.name.split(' ')[0]).join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Center Section - Welcome Message (Absolutely Centered) */}
        <div style={styles.headerCenter} className="header-center">
          {greeting && (
            <div style={styles.greeting(colors)}>
              {greeting}
            </div>
          )}
        </div>

        {/* Right Section - Clean and minimal */}
        <div style={styles.headerRight} className="header-right">
          {/* View Mode Toggle */}
          <div className="view-toggle-container" style={{ 
            display: 'flex', 
            gap: '4px', 
            padding: '4px', 
            borderRadius: '8px', 
            background: colors.surface, 
            border: `1px solid ${colors.border}`,
            justifyContent: 'center',
            width: 'auto'
          }}>
            <button
              onClick={() => setViewMode('board')}
              className="view-toggle-btn"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'board' ? colors.primary : 'transparent',
                color: viewMode === 'board' ? '#ffffff' : colors.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'board') {
                  e.currentTarget.style.background = colors.surfaceHover;
                  e.currentTarget.style.color = colors.text;
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'board') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }
              }}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="view-toggle-btn"
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === 'list' ? colors.primary : 'transparent',
                color: viewMode === 'list' ? '#ffffff' : colors.textSecondary,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.background = colors.surfaceHover;
                  e.currentTarget.style.color = colors.text;
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.textSecondary;
                }
              }}
            >
              List
            </button>
          </div>

          {/* AI Toggle Button */}
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: `1px solid ${colors.border}`,
              background: showAIPanel ? colors.primary : colors.surface,
              color: showAIPanel ? '#fff' : colors.text,
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              if (!showAIPanel) {
                e.currentTarget.style.background = colors.surfaceHover;
              }
            }}
            onMouseLeave={(e) => {
              if (!showAIPanel) {
                e.currentTarget.style.background = colors.surface;
              }
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"></path>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
            </svg>
            AI
          </button>

          {/* Member avatars */}
          {teamMembers.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {teamMembers.slice(0, 3).map((m, i) => (
                <div
                  key={m.id}
                  title={m.name}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, hsl(${(m.id * 67) % 360}, 65%, 50%), hsl(${(m.id * 67 + 30) % 360}, 65%, 45%))`,
                    border: `2px solid ${colors.surface}`,
                    marginLeft: i === 0 ? "0" : "-10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#fff",
                    cursor: "default",
                    zIndex: teamMembers.slice(0, 3).length - i,
                    position: "relative",
                    boxShadow: isDark ? "0 2px 6px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.12)",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
                >
                  {m.name[0].toUpperCase()}
                </div>
              ))}
              {teamMembers.length > 3 && (
                <div style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: colors.primaryLight,
                  border: `2px solid ${colors.surface}`,
                  marginLeft: "-10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "700",
                  color: colors.primary,
                  position: "relative",
                  boxShadow: isDark ? "0 2px 6px rgba(0,0,0,0.3)" : "0 2px 6px rgba(0,0,0,0.12)",
                }}>
                  +{teamMembers.length - 3}
                </div>
              )}
            </div>
          )}
          
          <SettingsDropdown />
        </div>
      </div>

      {/* Main Content - Adjusted for AI panel */}
      <div 
        style={{
          ...styles.mainContent,
          marginRight: showAIPanel ? '350px' : '0',
          transition: 'margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {viewMode === 'board' && (
          <div style={styles.board} className="board-grid">
            {(["todo", "doing", "done"] as const).map((col) => {
              const config = getColumnConfig(col);
              return (
                <div
                  key={col}
                  style={{
                    ...styles.column(colors, isDark),
                    border: dragOverCol === col 
                      ? `1px solid ${colors.primary}` 
                      : `1px solid ${colors.border}`,
                  }}
                  className={`column-${col}`}
                  onDragOver={(e) => onDragOverColumn(e, col)}
                  onDragLeave={onDragLeaveColumn}
                  onDrop={() => onDropColumn(col)}
                >
                  {/* Drag-over highlight layer */}
                  <div 
                    style={{
                      ...styles.columnHighlight,
                      ...(dragOverCol === col ? styles.columnHighlightActive : {}),
                    }}
                    className="column-highlight"
                  />
                  
                  <div style={styles.columnHeader} className={col === "doing" ? "column-header-doing" : ""}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "600", color: config.color }}>{config.icon}</span>
                      <div style={styles.columnTitle(colors)}>{config.title}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={styles.columnCount(colors)} className="column-count">{getColumnTasks(col).length}</div>
                      <button
                        style={styles.addBtn}
                        className="add-btn"
                        title={`Add to ${config.title}`}
                        onClick={() => promptCreateTask(col)}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#3a3a3a"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "transparent"; }}
                      >+</button>
                    </div>
                  </div>
                  
                  {/* Column header divider */}
                  <div style={styles.columnHeaderDivider} />
                  
                  <div style={styles.taskList} className="task-list">
                    {renderTasks(col)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <SoftListView
            tasks={tasks}
            onTaskClick={(taskId) => {
              setSelectedTaskId(taskId);
              setShowTaskDetail(true);
            }}
            onToggleComplete={async (taskId) => {
              const task = tasks.find(t => t.id === taskId);
              if (!task) return;
              const newStatus = task.status.toLowerCase() === 'done' ? 'todo' : 'done';
              try {
                const updated = await moveTask(taskId, newStatus);
                setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
              } catch {
                setAlertMessage("Failed to update task");
              }
            }}
            onToggleFavorite={(taskId) => {
              setFavoriteTaskIds(prev => {
                const next = new Set(prev);
                if (next.has(taskId)) next.delete(taskId);
                else next.add(taskId);
                return next;
              });
            }}
            selectedTaskId={selectedTaskId}
            favoriteTaskIds={favoriteTaskIds}
            onAddTask={() => setCreatePromptCol('todo')}
          />
        )}
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
      
      {/* Global Task Detail Modal (for both board and list view) */}
      {selectedTaskId !== null && showTaskDetail && (
        <TaskDetailModal
          task={tasks.find(t => t.id === selectedTaskId)!}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTaskId(null);
          }}
          onUpdate={async (taskId, updates) => {
            try {
              await updateTask(taskId, updates);
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
      
      {/* AI Side Panel */}
      <AISidePanel
        isOpen={showAIPanel}
      />
      
      {/* Bottom Navigation */}
      <BottomNav projectId={projectId} />
    </div>
  );
}
