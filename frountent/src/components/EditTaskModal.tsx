import { useState, useEffect } from "react";

interface EditTaskModalProps {
  isOpen: boolean;
  initialData: {
    title: string;
    assignedUserId?: number | null;
    assignedUserName?: string | null;
    dueDate?: string | null;
    description?: string;
  };
  teamMembers: Array<{ id: number; name: string }>;
  onSave: (data: {
    title: string;
    assignedUserId: number | null;
    dueDate: string | null;
    description: string;
  }) => void;
  onCancel: () => void;
}

export default function EditTaskModal({
  isOpen,
  initialData,
  teamMembers,
  onSave,
  onCancel,
}: EditTaskModalProps) {
  const [title, setTitle] = useState(initialData.title);
  const [assignedUserId, setAssignedUserId] = useState<number | null>(
    initialData.assignedUserId || null
  );
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [description, setDescription] = useState(initialData.description || "");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData.title);
      setAssignedUserId(initialData.assignedUserId || null);
      setDueDate(initialData.dueDate || "");
      setDescription(initialData.description || "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      assignedUserId,
      dueDate: dueDate || null,
      description: description.trim(),
    });
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
      onClick={onCancel}
    >
      <div
        style={{
          background: "#242424",
          borderRadius: "16px",
          padding: "24px",
          maxWidth: "500px",
          width: "100%",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Edit Task Details
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#aaa",
                marginBottom: "8px",
              }}
            >
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1a1a1a",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#aaa",
                marginBottom: "8px",
              }}
            >
              Assign To
            </label>
            <select
              value={assignedUserId || ""}
              onChange={(e) => setAssignedUserId(e.target.value ? Number(e.target.value) : null)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1a1a1a",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
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

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#aaa",
                marginBottom: "8px",
              }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1a1a1a",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#aaa",
                marginBottom: "8px",
              }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "#1a1a1a",
                color: "#fff",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Create Task
            </button>

            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "transparent",
                color: "#aaa",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
