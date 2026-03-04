import { useEffect, useState, useRef } from "react";
import {
  fetchProjects,
  createProject,
  renameProject,
  deleteProject,
  fetchTeams,
  fetchTeamProjects,
  createTeam,
  joinTeam,
  getCurrentUser,
} from "../services/api";

/* ─────────────────────────── styles ─────────────────────────── */
const s: any = {
  page: {
    padding: "40px",
    minHeight: "100vh",
    background: "#1a1a1a",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#fff",
    boxSizing: "border-box",
    overflowY: "auto",
  },

  /* top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "36px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: 0,
  },
  topActions: { display: "flex", gap: "10px", flexWrap: "wrap" as const },

  /* section headers */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    marginTop: "32px",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "#b3b3b3",
    margin: 0,
  },
  teamCodeBadge: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    background: "rgba(11,125,224,0.15)",
    color: "#0b7de0",
    border: "1px solid rgba(11,125,224,0.25)",
    borderRadius: "8px",
    padding: "4px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  },

  /* create bar */
  createBar: { display: "flex", gap: "12px", marginBottom: "20px" },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#242424",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxShadow: "inset 5px 5px 10px rgba(0,0,0,0.4), inset -5px -5px 10px rgba(60,60,60,0.08)",
    minWidth: 0,
  },

  /* project list */
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "8px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderRadius: "16px",
    background: "#242424",
    transition: "background 0.2s, box-shadow 0.2s",
    userSelect: "none" as const,
    cursor: "pointer",
  },
  cardLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 },
  projectEmoji: { fontSize: "20px", flexShrink: 0 },
  projectTitle: {
    fontSize: "15px", fontWeight: "500", color: "#f0f0f0",
    whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
  },
  renameInput: {
    flex: 1, background: "#1a1a1a", border: "1px solid #0b7de0",
    borderRadius: "8px", color: "#fff", fontSize: "15px",
    fontWeight: "500", padding: "6px 10px", outline: "none",
    boxShadow: "0 0 0 3px rgba(11,125,224,0.15)",
  },
  actions: {
    display: "flex", gap: "8px", flexShrink: 0,
    marginLeft: "16px", transition: "opacity 0.15s ease",
  },
  iconBtn: {
    width: "34px", height: "34px", borderRadius: "9px", border: "none",
    cursor: "pointer", fontSize: "15px", display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "background 0.2s", fontWeight: "700",
  },

  /* buttons */
  btnPrimary: {
    padding: "12px 20px", borderRadius: "12px", border: "none",
    background: "#0b7de0", color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
  },
  btnSuccess: {
    padding: "12px 20px", borderRadius: "12px", border: "none",
    background: "rgba(16,185,129,0.15)", color: "#10b981", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    border2: "1px solid rgba(16,185,129,0.25)",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
    transition: "all 0.2s ease",
  },
  btnOutline: {
    padding: "12px 20px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "transparent", color: "#b3b3b3", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    transition: "all 0.2s ease",
  },
  btnDanger: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "#ff4444", color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "14px",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
  },
  btnSecondary: {
    padding: "12px 24px", borderRadius: "10px", border: "none",
    background: "transparent", color: "#b3b3b3", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", transition: "all 0.2s ease",
  },

  /* empty state */
  empty: {
    padding: "28px 20px", borderRadius: "16px", background: "#1f1f1f",
    color: "#555", fontSize: "14px", textAlign: "center" as const,
    border: "1px dashed #333",
  },

  /* modal */
  modalOverlay: {
    position: "fixed" as const, top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, animation: "fadeIn 0.2s ease",
  },
  modalContent: {
    background: "#242424", padding: "32px", borderRadius: "20px",
    width: "420px", maxWidth: "92vw",
    boxShadow: "0 24px 48px rgba(0,0,0,0.6), inset 1px 1px 0 rgba(255,255,255,0.05)",
    display: "flex", flexDirection: "column" as const, gap: "20px",
  },
  modalTitle: { fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 },
  modalText: { fontSize: "14px", color: "#b3b3b3", margin: 0, lineHeight: "1.6" },
  modalInput: {
    width: "100%", padding: "16px 18px", borderRadius: "12px", border: "none",
    background: "#1a1a1a", color: "#ffffff", outline: "none", fontSize: "15px",
    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.4), inset -4px -4px 8px rgba(60,60,60,0.05)",
    boxSizing: "border-box" as const,
  },
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "4px" },

  /* team code display */
  codeDisplay: {
    background: "#1a1a1a", borderRadius: "12px", padding: "20px",
    textAlign: "center" as const,
    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.4)",
  },
  codeValue: {
    fontSize: "28px", fontWeight: "800", letterSpacing: "6px",
    color: "#0b7de0", fontFamily: "monospace",
  },
  codeHint: { fontSize: "12px", color: "#666", marginTop: "8px" },

  /* divider */
  divider: {
    height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0 24px 0",
  },
};

/* ─────────────────────────── component ─────────────────────── */
export default function ProjectBoard({ onSelect }: any) {
  const [personalProjects, setPersonalProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamProjects, setTeamProjects] = useState<Record<number, any[]>>({});
  const [, setCurrentUser] = useState<any | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);

  // hover / rename state per card
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // personal project create bar
  const [newTitle, setNewTitle] = useState("");

  // team project create per team
  const [teamNewTitle, setTeamNewTitle] = useState<Record<number, string>>({});

  // modals
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // create team modal
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createTeamName, setCreateTeamName] = useState("");
  const [createdTeamCode, setCreatedTeamCode] = useState<string | null>(null);
  const [createTeamLoading, setCreateTeamLoading] = useState(false);

  // join team modal
  const [showJoinTeam, setShowJoinTeam] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  // copied state for team code badge
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  /* ── load data ──────────────────────────────────────────────── */
  async function loadAll() {
    try {
      const [proj, myTeams] = await Promise.all([fetchProjects(), fetchTeams()]);
      setPersonalProjects(proj);
      setTeams(myTeams);

      if (myTeams.length > 0) {
        const results = await Promise.all(
          myTeams.map((t: any) => fetchTeamProjects(t.id).catch(() => []))
        );
        const map: Record<number, any[]> = {};
        myTeams.forEach((t: any, i: number) => { map[t.id] = results[i]; });
        setTeamProjects(map);
      }
    } catch (err) {
      console.error("Failed to load projects/teams", err);
    }
  }

  useEffect(() => { loadAll(); }, []);
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
  useEffect(() => { if (editingId !== null) editInputRef.current?.focus(); }, [editingId]);

  /* ── helpers ────────────────────────────────────────────────── */
  function startEdit(e: React.MouseEvent, p: any) {
    e.stopPropagation();
    setEditingId(p.id);
    setEditingTitle(p.title);
  }

  async function commitRename(id: number) {
    if (!editingTitle.trim()) { setEditingId(null); return; }
    try {
      const updated = await renameProject(id, editingTitle.trim());
      setPersonalProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      // also update in team projects
      setTeamProjects((prev) => {
        const next = { ...prev };
        for (const tid in next) {
          next[+tid] = next[+tid].map((p: any) => p.id === id ? updated : p);
        }
        return next;
      });
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to rename project");
    } finally { setEditingId(null); }
  }

  async function handleDeleteProject() {
    if (deleteConfirmId === null) return;
    try {
      await deleteProject(deleteConfirmId);
      setPersonalProjects((prev) => prev.filter((p) => p.id !== deleteConfirmId));
      setTeamProjects((prev) => {
        const next = { ...prev };
        for (const tid in next) { next[+tid] = next[+tid].filter((p: any) => p.id !== deleteConfirmId); }
        return next;
      });
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to delete project");
    } finally { setDeleteConfirmId(null); }
  }

  async function handleCreatePersonal() {
    if (!newTitle.trim()) return;
    try {
      const proj = await createProject(newTitle.trim());
      setPersonalProjects((prev) => [...prev, proj]);
      setNewTitle("");
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to create project");
    }
  }

  async function handleCreateTeamProject(teamId: number) {
    const title = (teamNewTitle[teamId] || "").trim();
    if (!title) return;
    try {
      const proj = await createProject(title, teamId);
      setTeamProjects((prev) => ({ ...prev, [teamId]: [...(prev[teamId] || []), proj] }));
      setTeamNewTitle((prev) => ({ ...prev, [teamId]: "" }));
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to create project");
    }
  }

  async function handleCreateTeam() {
    if (!createTeamName.trim()) return;
    setCreateTeamLoading(true);
    try {
      const team = await createTeam(createTeamName.trim());
      setCreatedTeamCode(team.team_code);
      setTeams((prev) => [...prev, team]);
      setTeamProjects((prev) => ({ ...prev, [team.id]: [] }));
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to create team");
      setShowCreateTeam(false);
    } finally {
      setCreateTeamLoading(false);
    }
  }

  async function handleJoinTeam() {
    if (!joinCode.trim()) return;
    setJoinLoading(true);
    try {
      const team = await joinTeam(joinCode.trim().toUpperCase());
      const projects = await fetchTeamProjects(team.id).catch(() => []);
      setTeams((prev) => {
        if (prev.find((t) => t.id === team.id)) return prev;
        return [...prev, team];
      });
      setTeamProjects((prev) => ({ ...prev, [team.id]: projects }));
      setShowJoinTeam(false);
      setJoinCode("");
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to join team");
    } finally { setJoinLoading(false); }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  /* ── project card renderer ──────────────────────────────────── */
  function renderCard(p: any) {
    const isHovered = hoveredId === p.id && editingId !== p.id;
    return (
      <div
        key={p.id}
        style={{
          ...s.card,
          background: isHovered ? "#2c2c2c" : "#242424",
          boxShadow: isHovered
            ? "8px 8px 20px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(11,125,224,0.2)"
            : "6px 6px 14px rgba(0,0,0,0.5)",
          cursor: editingId === p.id ? "default" : "pointer",
        }}
        onClick={() => editingId !== p.id && onSelect(p)}
        onMouseEnter={() => setHoveredId(p.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div style={s.cardLeft}>
          <span style={s.projectEmoji}>📂</span>
          {editingId === p.id ? (
            <input
              ref={editInputRef}
              style={s.renameInput}
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename(p.id);
                if (e.key === "Escape") setEditingId(null);
              }}
              onBlur={() => commitRename(p.id)}
            />
          ) : (
            <span style={s.projectTitle}>{p.title}</span>
          )}
        </div>

        <div style={{ ...s.actions, opacity: isHovered || editingId === p.id ? 1 : 0 }}>
          <button
            title={editingId === p.id ? "Confirm rename" : "Rename"}
            style={{
              ...s.iconBtn,
              background: editingId === p.id ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)",
              color: editingId === p.id ? "#10b981" : "#0b7de0",
            }}
            onClick={(e) => editingId === p.id ? commitRename(p.id) : startEdit(e, p)}
            onMouseEnter={(e) => { e.currentTarget.style.background = editingId === p.id ? "rgba(16,185,129,0.28)" : "rgba(11,125,224,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = editingId === p.id ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)"; }}
          >{editingId === p.id ? "✓" : "✏️"}</button>

          <button
            title="Delete project"
            style={{ ...s.iconBtn, background: "rgba(255,68,68,0.1)", color: "#ff6b6b" }}
            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.1)"; }}
          >🗑️</button>
        </div>
      </div>
    );
  }

  /* ── JSX ─────────────────────────────────────────────────────── */
  return (
    <div style={s.page}>
      <style>{`
        input::placeholder { color: #555; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {greeting && <div style={{ color: "#b3b3b3", fontSize: 14, marginBottom: 6 }}>{greeting}</div>}
          <h2 style={s.pageTitle}>🗂️ Projects</h2>
        </div>
        <div style={s.topActions}>
          <button
            style={s.btnOutline}
            onClick={() => { setShowJoinTeam(true); setJoinCode(""); }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
          >🔗 Join Team</button>

          <button
            style={s.btnSuccess}
            onClick={() => { setShowCreateTeam(true); setCreateTeamName(""); setCreatedTeamCode(null); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}
          >👥 Create Team</button>
        </div>
      </div>

      {/* ── Personal Projects ── */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>👤 My Projects</h3>
      </div>

      <div style={s.createBar}>
        <input
          style={s.input}
          placeholder="New personal project…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreatePersonal()}
        />
        <button
          style={s.btnPrimary}
          onClick={handleCreatePersonal}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
        >+ New Project</button>
      </div>

      <div style={s.list}>
        {personalProjects.length === 0
          ? <div style={s.empty}>No personal projects yet. Create one above!</div>
          : personalProjects.map(renderCard)
        }
      </div>

      {/* ── Team Sections ── */}
      {teams.map((team) => (
        <div key={team.id}>
          <div style={s.divider} />

          <div style={s.sectionHeader}>
            <h3 style={{ ...s.sectionTitle }}>👥 {team.name}</h3>
            <div
              style={{
                ...s.teamCodeBadge,
                background: copiedCode === team.team_code ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)",
                color: copiedCode === team.team_code ? "#10b981" : "#0b7de0",
                borderColor: copiedCode === team.team_code ? "rgba(16,185,129,0.3)" : "rgba(11,125,224,0.25)",
              }}
              title="Click to copy team code"
              onClick={() => copyCode(team.team_code)}
              onMouseEnter={(e: any) => { e.currentTarget.style.background = "rgba(11,125,224,0.22)"; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.background = copiedCode === team.team_code ? "rgba(16,185,129,0.15)" : "rgba(11,125,224,0.12)"; }}
            >
              {copiedCode === team.team_code ? "✓ Copied!" : `# ${team.team_code}`}
            </div>
          </div>

          <div style={s.createBar}>
            <input
              style={s.input}
              placeholder={`New project in ${team.name}…`}
              value={teamNewTitle[team.id] || ""}
              onChange={(e) => setTeamNewTitle((prev) => ({ ...prev, [team.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTeamProject(team.id)}
            />
            <button
              style={s.btnPrimary}
              onClick={() => handleCreateTeamProject(team.id)}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
            >+ Add Project</button>
          </div>

          <div style={s.list}>
            {(teamProjects[team.id] || []).length === 0
              ? <div style={s.empty}>No projects in this team yet. Add one above!</div>
              : (teamProjects[team.id] || []).map(renderCard)
            }
          </div>
        </div>
      ))}

      {/* ───────────────── MODALS ───────────────── */}

      {/* Delete Confirmation */}
      {deleteConfirmId !== null && (
        <div style={s.modalOverlay} onClick={() => setDeleteConfirmId(null)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Delete Project</h3>
            <p style={s.modalText}>Are you sure? This will delete the project and all its tasks. This cannot be undone.</p>
            <div style={s.modalButtons}>
              <button style={s.btnSecondary} onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
              <button style={s.btnDanger} onClick={handleDeleteProject}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "none"; }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div style={s.modalOverlay} onClick={() => { if (!createdTeamCode) setShowCreateTeam(false); }}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            {createdTeamCode ? (
              <>
                <h3 style={s.modalTitle}>✅ Team Created!</h3>
                <p style={s.modalText}>Share this code with your teammates so they can join:</p>
                <div style={s.codeDisplay}>
                  <div style={s.codeValue}>{createdTeamCode}</div>
                  <div style={s.codeHint}>Click the code badge on your team section to copy anytime</div>
                </div>
                <div style={s.modalButtons}>
                  <button
                    style={s.btnPrimary}
                    onClick={() => { copyCode(createdTeamCode); setShowCreateTeam(false); setCreatedTeamCode(null); setCreateTeamName(""); }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
                  >📋 Copy & Close</button>
                </div>
              </>
            ) : (
              <>
                <h3 style={s.modalTitle}>Create a Team</h3>
                <p style={s.modalText}>Give your team a name. A unique join code will be generated automatically.</p>
                <input
                  style={s.modalInput}
                  autoFocus
                  placeholder="Team name…"
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateTeam(); if (e.key === "Escape") setShowCreateTeam(false); }}
                />
                <div style={s.modalButtons}>
                  <button style={s.btnSecondary} onClick={() => setShowCreateTeam(false)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
                  <button
                    style={{ ...s.btnPrimary, opacity: createTeamLoading ? 0.6 : 1 }}
                    onClick={handleCreateTeam}
                    disabled={createTeamLoading}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
                  >{createTeamLoading ? "Creating…" : "Create Team"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinTeam && (
        <div style={s.modalOverlay} onClick={() => setShowJoinTeam(false)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Join a Team</h3>
            <p style={s.modalText}>Enter the team code shared by your teammate (case-insensitive).</p>
            <input
              style={{ ...s.modalInput, letterSpacing: "4px", textTransform: "uppercase", fontFamily: "monospace", fontSize: "18px" }}
              autoFocus
              placeholder="XXXXXXXX"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoinTeam(); if (e.key === "Escape") setShowJoinTeam(false); }}
              maxLength={8}
            />
            <div style={s.modalButtons}>
              <button style={s.btnSecondary} onClick={() => setShowJoinTeam(false)}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#b3b3b3"; }}>Cancel</button>
              <button
                style={{ ...s.btnPrimary, opacity: joinLoading ? 0.6 : 1 }}
                onClick={handleJoinTeam}
                disabled={joinLoading}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}
              >{joinLoading ? "Joining…" : "🔗 Join Team"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage !== null && (
        <div style={s.modalOverlay} onClick={() => setAlertMessage(null)}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Notice</h3>
            <p style={s.modalText}>{alertMessage}</p>
            <div style={s.modalButtons}>
              <button style={s.btnPrimary} onClick={() => setAlertMessage(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a8cf0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#0b7de0"; }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
