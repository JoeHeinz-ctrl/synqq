import { useEffect, useRef, useState } from "react";
import { fetchTasks, createTask, moveTask, deleteTask, renameTask, reorderTasks, getCurrentUser } from "../services/api";


const styles: any = {
  container: {
    padding: "40px",
    background: "#1a1a1a",
    height: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#242424",
    color: "#b3b3b3",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "all 0.2s ease",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
  },

  header: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "4px",
    letterSpacing: "-0.5px",
    color: "#ffffff",
  },

  subheader: {
    fontSize: "13px",
    color: "#b3b3b3",
    marginBottom: "16px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  taskEditBtn: {
    background: "transparent",
    border: "none",
    color: "#666666",
    fontSize: "14px",
    cursor: "pointer",
    padding: "4px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  board: {
    display: "flex",
    gap: "16px",
    flex: 1,
    overflow: "hidden",
    marginBottom: "12px",
  },

  column: {
    flex: 1,
    background: "#242424",
    padding: "20px 10px 10px 10px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.05)",
    overflow: "hidden",
  },

  columnHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px",
    padding: "0 10px 16px 10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    flexShrink: 0,
  },

  taskList: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    display: "flex",
    flexDirection: "column",
    padding: "10px 10px 20px 10px",
  },

  columnTitle: {
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#b3b3b3",
    textTransform: "uppercase",
  },

  columnCount: {
    background: "#2a2a2a",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#0b7de0",
    boxShadow: "inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(60, 60, 60, 0.1)",
  },

  card: {
    background: "#2a2a2a",
    padding: "10px 14px",
    borderRadius: "12px",
    marginBottom: "8px",
    cursor: "grab",
    transition: "all 0.15s ease",
    color: "#ffffff",
    fontSize: "13px",
    userSelect: "none",
    boxShadow: "6px 6px 12px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(60, 60, 60, 0.05)",
    position: "relative",
    flexShrink: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropIndicator: {
    height: "2px",
    borderRadius: "2px",
    background: "#0b7de0",
    marginBottom: "8px",
    transition: "opacity 0.15s ease",
    boxShadow: "0 0 6px rgba(11,125,224,0.6)",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    color: "#666666",
    fontSize: "14px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
    opacity: 0.3,
  },

  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease",
  },
  modalContent: {
    background: "#242424",
    padding: "32px",
    borderRadius: "20px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 1px 1px 0px rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  modalTitle: { fontSize: "20px", fontWeight: "600", color: "#fff", margin: 0 },
  modalText: { fontSize: "15px", color: "#b3b3b3", margin: 0, lineHeight: "1.5" },
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" },
  modalInput: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "none",
    background: "#1a1a1a",
    color: "#ffffff",
    outline: "none",
    fontSize: "15px",
    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(60,60,60,0.05)",
    boxSizing: "border-box",
  },
  btnPrimary: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "#0b7de0", color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "14px",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
    transition: "all 0.2s ease",
  },
  btnDanger: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "#ff4444", color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "14px",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -4px -4px 8px rgba(60,60,60,0.05)",
    transition: "all 0.2s ease",
  },
  btnSecondary: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "transparent", color: "#b3b3b3", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", transition: "all 0.2s ease",
  },
};

export default function Dashboard({ project, backToProjects }: any) {

  const [tasks, setTasks] = useState<any[]>([]);
  const [, setCurrentUser] = useState<any | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  // ── drag state ────────────────────────────────────────────────────────────
  // draggedTask    – the task being dragged
  // dragOverCol    – which column is highlighted (for cross-column drops)
  // dragOverTaskId – the task the cursor is currently above (for reorder indicator)
  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);

  // Custom Modal States
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [createPromptCol, setCreatePromptCol] = useState<string | null>(null);
  const [createTaskTitle, setCreateTaskTitle] = useState("");
  const [editTaskData, setEditTaskData] = useState<{ id: number; title: string } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // **Keyboard/selection state**
  // pressed shortcuts should operate on the currently selected task.
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // keep a ref we can read inside drag handlers (avoids stale closures)
  const tasksRef = useRef(tasks);
  useEffect(() => { tasksRef.current = tasks; }, [tasks]);

  useEffect(() => {
    if (!project) { setTasks([]); return; }
    fetchTasks(project.id).then(setTasks).catch(() => setTasks([]));
  }, [project]);

  // clear selection if the selected task disappears
  useEffect(() => {
    if (selectedTaskId !== null && !tasks.find((t) => t.id === selectedTaskId)) {
      setSelectedTaskId(null);
    }
  }, [tasks, selectedTaskId]);

  // Fetch current user and compute greeting
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

  // ── task modal helpers ────────────────────────────────────────────────────
  const promptCreateTask = (status: string) => { setCreatePromptCol(status); setCreateTaskTitle(""); };

  const confirmCreateTask = async () => {
    if (!createPromptCol) return;
    const title = createTaskTitle.trim();
    if (!title) { setCreatePromptCol(null); return; }
    if (!project) { setAlertMessage("Select a project first"); setCreatePromptCol(null); return; }
    try {
      const created = await createTask(title, project.id, createPromptCol.toLowerCase());
      setTasks((prev) => [...prev, created]);
    } catch { setAlertMessage("Failed to create task"); }
    finally { setCreatePromptCol(null); }
  };

  const onClickDeleteTask = (e: React.MouseEvent, taskId: number) => { e.stopPropagation(); setDeleteConfirmId(taskId); };

  const confirmDeleteTask = async () => {
    if (deleteConfirmId === null) return;
    try {
      await deleteTask(deleteConfirmId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteConfirmId));
    } catch { setAlertMessage("Failed to delete task"); }
    finally { setDeleteConfirmId(null); }
  };

  const promptEditTask = (e: React.MouseEvent, task: any) => { e.stopPropagation(); setSelectedTaskId(task.id); setEditTaskData({ id: task.id, title: task.title }); };

  const confirmEditTask = async () => {
    if (!editTaskData) return;
    const title = editTaskData.title.trim();
    if (!title) { setEditTaskData(null); return; }
    try {
      const updated = await renameTask(editTaskData.id, title);
      setTasks((prev) => prev.map((t) => (t.id === editTaskData.id ? updated : t)));
    } catch { setAlertMessage("Failed to edit task"); }
    finally { setEditTaskData(null); }
  };

  // select a task card (used by click and keyboard helpers)
  const selectTask = (taskId: number | null) => {
    setSelectedTaskId(taskId);
  };

  // edit a task directly (keyboard shortcut can call this)
  const editTaskById = (task: any) => {
    setSelectedTaskId(task.id);
    setEditTaskData({ id: task.id, title: task.title });
  };

  // move the selected task to done column
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

  // global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore when focus is on an input/textarea or a modal is showing
      const tag = (e.target as HTMLElement).tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement).isContentEditable ||
        deleteConfirmId !== null ||
        createPromptCol !== null ||
        editTaskData !== null ||
        alertMessage !== null
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "n") {
        // new task in same column as selected, or default todo
        const col = selectedTaskId
          ? normalizeStatus(tasks.find((x) => x.id === selectedTaskId)?.status || "")
          : "todo";
        promptCreateTask(col.toUpperCase());
      } else if (key === "e") {
        const t = selectedTaskId !== null && tasks.find((x) => x.id === selectedTaskId);
        if (t) editTaskById(t);
      } else if (key === "d") {
        markSelectedDone();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedTaskId, tasks]);

  // ── drag handlers ─────────────────────────────────────────────────────────
  const onDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragEnd = () => {
    setDraggedTask(null);
    setDragOverCol(null);
    setDragOverTaskId(null);
  };

  /** Called when dragging over a specific task card — for within-column reorder */
  const onDragOverTask = (e: React.DragEvent, hoveredTask: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedTask || hoveredTask.id === draggedTask.id) return;
    setDragOverTaskId(hoveredTask.id);
  };

  /** Called when dragging over the column background (empty area or cross-col) */
  const onDragOverColumn = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    setDragOverCol(col);
  };

  const onDragLeaveColumn = () => {
    setDragOverCol(null);
  };

  /**
   * Drop on a task card → reorder within same column,
   * OR move to the column if it's a different column.
   */
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
      // ── Reorder within the same column ─────────────────────────────────
      const colTasks = current.filter((t) => normalizeStatus(t.status) === normalizeStatus(targetTask.status));
      const fromIdx = colTasks.findIndex((t) => t.id === draggedTask.id);
      const toIdx = colTasks.findIndex((t) => t.id === targetTask.id);

      const reordered = [...colTasks];
      reordered.splice(fromIdx, 1);
      reordered.splice(toIdx, 0, draggedTask);

      // Optimistic update
      const otherTasks = current.filter((t) => normalizeStatus(t.status) !== normalizeStatus(targetTask.status));
      setTasks([...otherTasks, ...reordered]);

      // Persist
      try { await reorderTasks(reordered.map((t) => t.id)); }
      catch { fetchTasks(project.id).then(setTasks); }
    } else {
      // ── Move to a different column ───────────────────────────────────────
      try {
        const updated = await moveTask(draggedTask.id, normalizeStatus(targetTask.status));
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } catch { setAlertMessage("Failed to move task"); }
    }

    setDraggedTask(null);
    setDragOverCol(null);
    setDragOverTaskId(null);
  };

  /** Drop on the column background → move to that column (at end) */
  const onDropColumn = async (col: string) => {
    if (!draggedTask) return;
    if (normalizeStatus(draggedTask.status) === col) {
      // Same column — just clear state, no-op
      setDraggedTask(null);
      setDragOverCol(null);
      setDragOverTaskId(null);
      return;
    }
    try {
      const updated = await moveTask(draggedTask.id, col);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch { setAlertMessage("Failed to move task"); }
    finally {
      setDraggedTask(null);
      setDragOverCol(null);
      setDragOverTaskId(null);
    }
  };

  // ── helpers ───────────────────────────────────────────────────────────────
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

  const columnStyle = (name: string) => ({
    ...styles.column,
    boxShadow: "8px 8px 16px rgba(0,0,0,0.5), -8px -8px 16px rgba(60,60,60,0.05)",
    outline:
      dragOverCol === name
        ? `2px solid ${getColumnConfig(name).color}`
        : "2px solid transparent",
    outlineOffset: "-2px",
  });

  // ── render tasks ──────────────────────────────────────────────────────────
  const renderTasks = (status: string) => {
    const colTasks = getColumnTasks(status);

    if (colTasks.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>{getColumnConfig(status).emoji}</div>
          <div>No tasks yet</div>
        </div>
      );
    }

    return colTasks.map((t) => (
      <div key={t.id}>
        {/* Blue drop-line indicator shown above the hovered task */}
        {dragOverTaskId === t.id && draggedTask?.id !== t.id && (
          <div style={styles.dropIndicator} />
        )}

        <div
          style={{
            ...styles.card,
            opacity: draggedTask?.id === t.id ? 0.4 : 1,
            transform: draggedTask?.id === t.id ? "scale(1.03)" : "scale(1)",
            boxShadow:
              draggedTask?.id === t.id
                ? "8px 8px 20px rgba(0,0,0,0.6)"
                : "6px 6px 12px rgba(0,0,0,0.4), -6px -6px 12px rgba(60,60,60,0.05)",
            cursor: "grab",
            outline: selectedTaskId === t.id ? "2px solid #0b7de0" : "none",
            outlineOffset: "-2px",
          }}
          draggable
          onClick={(e) => { e.stopPropagation(); selectTask(t.id); }}
          onDragStart={(e) => onDragStart(e, t)}
          onDragEnd={onDragEnd}
          onDragOver={(e) => onDragOverTask(e, t)}
          onDrop={(e) => onDropOnTask(e, t)}
        >
          <span style={{ flex: 1, paddingRight: "8px" }}>{t.title}</span>
          <div style={{ display: "flex", gap: "2px" }}>
            <button
              style={styles.taskEditBtn}
              title="Edit task"
              onClick={(e) => promptEditTask(e, t)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#0b7de0"; e.currentTarget.style.background = "rgba(11,125,224,0.1)"; e.currentTarget.style.borderRadius = "6px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
            >✏️</button>
            <button
              style={styles.taskDeleteBtn}
              title="Delete task"
              onClick={(e) => onClickDeleteTask(e, t.id)}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#ff6b6b"; e.currentTarget.style.background = "rgba(255,68,68,0.1)"; e.currentTarget.style.borderRadius = "6px"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#666666"; e.currentTarget.style.background = "transparent"; }}
            >🗑️</button>
          </div>
        </div>
      </div>
    ));
  };

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container} onClick={() => selectTask(null)}>
      <style>{`
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: #666666; }
      `}</style>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div style={styles.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Delete Task</h3>
            <p style={styles.modalText}>Are you sure you want to delete this task? This action cannot be undone.</p>
            <div style={styles.modalButtons}>
              <button style={styles.btnSecondary} onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
              <button style={styles.btnDanger} onClick={confirmDeleteTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "translateY(0)"; }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editTaskData !== null && (
        <div style={styles.modalOverlay} onClick={() => setEditTaskData(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Task</h3>
            <input style={styles.modalInput} autoFocus placeholder="What needs to be done?"
              value={editTaskData.title}
              onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") confirmEditTask(); if (e.key === "Escape") setEditTaskData(null); }} />
            <div style={styles.modalButtons}>
              <button style={styles.btnSecondary} onClick={() => setEditTaskData(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
              <button style={styles.btnPrimary} onClick={confirmEditTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; e.currentTarget.style.transform = "translateY(0)"; }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {createPromptCol !== null && (
        <div style={styles.modalOverlay} onClick={() => setCreatePromptCol(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>New Task ({createPromptCol})</h3>
            <input style={styles.modalInput} autoFocus placeholder="What needs to be done?"
              value={createTaskTitle}
              onChange={(e) => setCreateTaskTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmCreateTask(); if (e.key === "Escape") setCreatePromptCol(null); }} />
            <div style={styles.modalButtons}>
              <button style={styles.btnSecondary} onClick={() => setCreatePromptCol(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
              <button style={styles.btnPrimary} onClick={confirmCreateTask}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; e.currentTarget.style.transform = "translateY(0)"; }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Error Modal */}
      {alertMessage !== null && (
        <div style={styles.modalOverlay} onClick={() => setAlertMessage(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Notice</h3>
            <p style={styles.modalText}>{alertMessage}</p>
            <div style={styles.modalButtons}>
              <button style={styles.btnPrimary} onClick={() => setAlertMessage(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}>OK</button>
            </div>
          </div>
        </div>
      )}

      <button style={styles.backBtn} onClick={backToProjects}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#2c2c2c"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "#242424"; }}>
        ← Back to Projects
      </button>

      <div>
        {greeting && <div style={{ ...styles.subheader, fontSize: 16, marginBottom: 8 }}>{greeting}</div>}
        <div style={styles.header}>{project ? project.title : "Project Board"}</div>
        <div style={styles.subheader}>{tasks.length} total tasks</div>
        <div style={{ ...styles.subheader, fontSize: 11, opacity: 0.7 }}>
          Keyboard shortcuts: <kbd>N</kbd> = new task, <kbd>E</kbd> = edit selected, <kbd>D</kbd> = mark done
        </div>
      </div>

      <div style={styles.board}>
        {(["todo", "doing", "done"] as const).map((col) => (
          <div
            key={col}
            style={columnStyle(col)}
            onDragOver={(e) => onDragOverColumn(e, col)}
            onDragLeave={onDragLeaveColumn}
            onDrop={() => onDropColumn(col)}
          >
            <div style={styles.columnHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{getColumnConfig(col).emoji}</span>
                <div style={styles.columnTitle}>{col}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={styles.columnCount}>{getColumnTasks(col).length}</div>
                <button
                  style={styles.addBtn}
                  title={`Add to ${col.toUpperCase()}`}
                  onClick={() => promptCreateTask(col.toUpperCase())}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.background = "#3a3a3a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.background = "transparent"; }}
                >+</button>
              </div>
            </div>
            <div style={styles.taskList}>
              {renderTasks(col)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}