import { useState } from "react";

interface AiTaskSuggestionProps {
  messageId: string;
  suggestion: {
    title: string;
    assignee?: {
      id: number | null;
      name: string;
    } | null;
    dueDate?: string | null;
    confidence?: number;
  };
  onCreateTask: (taskData: any) => void;
  onEdit: () => void;
  onIgnore: () => void;
}

export default function AiTaskSuggestion({
  suggestion,
  onCreateTask,
  onEdit,
  onIgnore,
}: AiTaskSuggestionProps) {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await onCreateTask({
        title: suggestion.title,
        assignedUserId: suggestion.assignee?.id,
        dueDate: suggestion.dueDate,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const formatDueDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: "12px",
        padding: "12px 16px",
        marginTop: "8px",
        marginBottom: "8px",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#a78bfa",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          SYNQ AI Suggestion
        </span>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>
          Task: {suggestion.title}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "13px", color: "#aaa" }}>
          {suggestion.assignee && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Assigned to: {suggestion.assignee.name}</span>
            </div>
          )}

          {suggestion.dueDate && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Due: {formatDueDate(suggestion.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          style={{
            flex: 1,
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "13px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          {isCreating ? "Creating..." : "Create Task"}
        </button>

        <button
          onClick={onEdit}
          disabled={isCreating}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            background: "transparent",
            color: "#a78bfa",
            fontWeight: "600",
            fontSize: "13px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          Edit
        </button>

        <button
          onClick={onIgnore}
          disabled={isCreating}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "transparent",
            color: "#888",
            fontWeight: "600",
            fontSize: "13px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
        >
          Ignore
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
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
