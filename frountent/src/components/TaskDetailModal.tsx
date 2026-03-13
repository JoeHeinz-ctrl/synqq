interface TaskDetailModalProps {
  isOpen: boolean;
  task: {
    id: number;
    title: string;
    description?: string;
    due_date?: string;
    assigned_user_id?: number;
    assignedUserName?: string;
  } | null;
  onClose: () => void;
}

export default function TaskDetailModal({ isOpen, task, onClose }: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const formatDueDate = (dateStr: string | undefined) => {
    if (!dateStr) return "No due date";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <span style={{ fontSize: "20px" }}>📋</span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#a78bfa",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Task Details
          </span>
        </div>

        {/* Task Title */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "18px", fontWeight: "700", color: "#fff", lineHeight: "1.4" }}>
            {task.title}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
          {/* Due Date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(139, 92, 246, 0.05)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <span style={{ fontSize: "18px" }}>📅</span>
            <div>
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Due Date
              </div>
              <div style={{ fontSize: "14px", color: "#fff", fontWeight: "500", marginTop: "2px" }}>
                {formatDueDate(task.due_date)}
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.05)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <span style={{ fontSize: "18px" }}>👤</span>
            <div>
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Assigned To
              </div>
              <div style={{ fontSize: "14px", color: "#fff", fontWeight: "500", marginTop: "2px" }}>
                {task.assignedUserName || "Unassigned"}
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📝 Description
              </div>
              <div style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                {task.description}
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            background: "transparent",
            color: "#a78bfa",
            fontWeight: "600",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          Close
        </button>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
