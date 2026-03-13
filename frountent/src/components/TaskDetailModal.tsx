interface TaskDetailPanelProps {
  task: {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    assigned_user_id?: number;
    status?: string;
  } | null;
  onClose: () => void;
  onUpdate: (taskId: number, updates: any) => void;
  teamMembers: Array<{ id: number; name: string }>;
}

export default function TaskDetailModal({ task, onClose, onUpdate, teamMembers }: TaskDetailPanelProps) {
  if (!task) return null;

  const formatDueDate = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toISOString().split("T")[0];
    } catch {
      return dateStr;
    }
  };

  const handleSave = (field: string, value: any) => {
    onUpdate(task.id, { [field]: value });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        borderRadius: "12px",
        padding: "16px",
        marginTop: "12px",
        animation: "slideDown 0.3s ease-out",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>📋</span>
          <span style={{ fontSize: "12px", fontWeight: "600", color: "#a78bfa", textTransform: "uppercase" }}>
            Task Details
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "#888",
            fontSize: "18px",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          ✕
        </button>
      </div>

      {/* Task Title */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          Title
        </label>
        <input
          type="text"
          defaultValue={task.title}
          onBlur={(e) => handleSave("title", e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            background: "rgba(139, 92, 246, 0.05)",
            color: "#fff",
            fontSize: "14px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        {/* Due Date */}
        <div>
          <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            📅 Due Date
          </label>
          <input
            type="date"
            defaultValue={formatDueDate(task.due_date)}
            onBlur={(e) => handleSave("due_date", e.target.value || null)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              background: "rgba(59, 130, 246, 0.05)",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Assigned To */}
        <div>
          <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            👤 Assigned To
          </label>
          <select
            defaultValue={task.assigned_user_id || ""}
            onChange={(e) => handleSave("assigned_user_id", e.target.value ? Number(e.target.value) : null)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              background: "rgba(16, 185, 129, 0.05)",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
            }}
          >
            <option value="">Unassigned</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          📝 Description
        </label>
        <textarea
          defaultValue={task.description || ""}
          onBlur={(e) => handleSave("description", e.target.value || null)}
          rows={3}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            background: "rgba(139, 92, 246, 0.05)",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "vertical",
          }}
          placeholder="Add task description..."
        />
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
