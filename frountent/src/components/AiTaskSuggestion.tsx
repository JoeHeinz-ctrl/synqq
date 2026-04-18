import { useState } from "react";
import { Sparkles } from "lucide-react";

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
        <Sparkles size={16} style={{ color: "#a78bfa" }} />
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
              <span>👤</span>
              <span>Assigned to: {suggestion.assignee.name}</span>
            </div>
          )}

          {suggestion.dueDate && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span>📅</span>
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
