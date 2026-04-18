import { useState } from "react";
import { Sparkles, User } from "lucide-react";

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
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(59, 130, 246, 0.08))",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        borderRadius: "14px",
        padding: "16px 18px",
        marginTop: "12px",
        marginBottom: "12px",
        animation: "slideIn 0.3s ease-out",
        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <div style={{
          width: "28px",
          height: "28px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <Sparkles size={14} style={{ color: "#fff" }} />
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: "700",
            color: "#a78bfa",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          AI Task Suggestion
        </span>
      </div>

      <div style={{ marginBottom: "16px", paddingLeft: "2px" }}>
        <div style={{ 
          fontSize: "15px", 
          fontWeight: "600", 
          color: "#fff", 
          marginBottom: "10px",
          lineHeight: "1.5",
        }}>
          {suggestion.title}
        </div>

        <div style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "12px", 
          fontSize: "13px", 
          color: "#a0a0a0" 
        }}>
          {suggestion.assignee && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.05)",
            }}>
              <User className="w-4 h-4" />
              <span>{suggestion.assignee.name}</span>
            </div>
          )}

          {suggestion.dueDate && (
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.05)",
            }}>
              <span style={{ fontSize: "14px" }}>📅</span>
              <span>{formatDueDate(suggestion.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleCreate}
          disabled={isCreating}
          style={{
            flex: 1,
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "14px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!isCreating) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {isCreating ? "Creating..." : "✓ Create Task"}
        </button>

        <button
          onClick={onEdit}
          disabled={isCreating}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            background: "rgba(139, 92, 246, 0.05)",
            color: "#a78bfa",
            fontWeight: "600",
            fontSize: "14px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isCreating) e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(139, 92, 246, 0.05)";
          }}
        >
          Edit
        </button>

        <button
          onClick={onIgnore}
          disabled={isCreating}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "transparent",
            color: "#888",
            fontWeight: "600",
            fontSize: "14px",
            cursor: isCreating ? "not-allowed" : "pointer",
            opacity: isCreating ? 0.6 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!isCreating) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.color = "#aaa";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#888";
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
