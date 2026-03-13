import { useState } from "react";

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
  const [isSaving, setIsSaving] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [formData, setFormData] = useState(task ? {
    title: task.title,
    due_date: task.due_date || "",
    assigned_user_id: task.assigned_user_id || "",
    description: task.description || "",
  } : null);

  if (!task || !formData) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(task.id, {
        title: formData.title,
        due_date: formData.due_date || null,
        assigned_user_id: formData.assigned_user_id ? Number(formData.assigned_user_id) : null,
        description: formData.description || null,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(30, 30, 30, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "24px",
        marginTop: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        animation: "slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ 
            width: "32px", 
            height: "32px", 
            borderRadius: "10px", 
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px"
          }}>📋</div>
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "0.5px" }}>
            TASK DETAILS
          </span>
        </div>
      </div>

      {/* Task Title */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            background: "rgba(255, 255, 255, 0.03)",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = "1px solid rgba(139, 92, 246, 0.4)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
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
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              background: "rgba(255, 255, 255, 0.03)",
              color: "#fff",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              colorScheme: "dark",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => e.currentTarget.style.border = "1px solid rgba(59, 130, 246, 0.4)"}
            onBlur={(e) => e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.05)"}
          />
        </div>

        {/* Assigned To */}
        <div style={{ position: "relative" }}>
          <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
            👤 Assigned To
          </label>
          <div 
            onClick={() => setShowMembers(!showMembers)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              background: "rgba(16, 185, 129, 0.05)",
              color: "#fff",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <span>
              {formData.assigned_user_id 
                ? teamMembers.find(m => m.id === Number(formData.assigned_user_id))?.name || "Member not found"
                : "Unassigned"}
            </span>
            <span style={{ fontSize: "10px", opacity: 0.6 }}>{showMembers ? "▲" : "▼"}</span>
          </div>

          {showMembers && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "4px",
              background: "#1a1a1a",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}>
              <div 
                onClick={() => {
                  setFormData({ ...formData, assigned_user_id: "" });
                  setShowMembers(false);
                }}
                style={{
                  padding: "10px 12px",
                  fontSize: "13px",
                  color: !formData.assigned_user_id ? "#10b981" : "#888",
                  cursor: "pointer",
                  background: !formData.assigned_user_id ? "rgba(16, 185, 129, 0.1)" : "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"}
                onMouseLeave={e => {
                  if (formData.assigned_user_id) e.currentTarget.style.background = "transparent";
                }}
              >
                Unassigned
              </div>
              {teamMembers.map((member) => (
                <div 
                  key={member.id}
                  onClick={() => {
                    setFormData({ ...formData, assigned_user_id: String(member.id) });
                    setShowMembers(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: Number(formData.assigned_user_id) === member.id ? "#10b981" : "#fff",
                    cursor: "pointer",
                    background: Number(formData.assigned_user_id) === member.id ? "rgba(16, 185, 129, 0.1)" : "transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"}
                  onMouseLeave={e => {
                    if (Number(formData.assigned_user_id) !== member.id) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {member.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
          📝 Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            background: "rgba(255, 255, 255, 0.03)",
            color: "#fff",
            fontSize: "13px",
            lineHeight: "1.6",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "vertical",
            transition: "all 0.2s ease",
          }}
          onFocus={(e) => e.currentTarget.style.border = "1px solid rgba(139, 92, 246, 0.4)"}
          onBlur={(e) => e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.05)"}
          placeholder="Add task description..."
        />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
            color: "#fff",
            fontWeight: "700",
            fontSize: "13px",
            cursor: isSaving ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 92, 246, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 92, 246, 0.3)";
            }
          }}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          onClick={onClose}
          disabled={isSaving}
          style={{
            flex: 0.4,
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            background: "rgba(255, 255, 255, 0.03)",
            color: "#888",
            fontWeight: "600",
            fontSize: "13px",
            cursor: isSaving ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSaving) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            if (!isSaving) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              e.currentTarget.style.color = "#888";
            }
          }}
        >
          Cancel
        </button>
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
