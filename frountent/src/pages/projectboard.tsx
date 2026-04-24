import { useEffect, useState, useRef } from "react";
import {
  fetchProjects,
  createProject,
  renameProject,
  deleteProject,
  deleteTeam,
  fetchTeams,
  fetchTeamProjects,
  createTeam,
  joinTeam,
  getCurrentUser,
  fetchTeamMembers,
} from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "../components/SettingsDropdown";
import { UsageIndicator } from "../components/ui/UsageIndicator";
import { LimitAlert } from "../components/ui/UpgradePrompt";

/* ─────────────────────────── styles ─────────────────────────── */
const s: any = {
  page: (colors: any) => ({
    padding: "40px",
    minHeight: "100vh",
    background: colors.background,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: colors.text,
    boxSizing: "border-box",
    overflowY: "auto",
  }),

  /* top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "36px",
    flexWrap: "wrap" as const,
    gap: "16px",
  },
  pageTitle: (colors: any) => ({
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: 0,
    color: colors.text,
  }),
  topActions: { display: "flex", gap: "10px", flexWrap: "wrap" as const },

  /* section headers */
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
    marginTop: "32px",
  },
  sectionTitle: (colors: any) => ({
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: colors.textSecondary,
    margin: 0,
  }),
  teamCodeBadge: (colors: any) => ({
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    background: colors.primaryLight,
    color: colors.primary,
    border: `1px solid ${colors.primary}40`,
    borderRadius: "8px",
    padding: "4px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
  }),

  /* create bar */
  createBar: { display: "flex", gap: "12px", marginBottom: "20px" },
  input: (colors: any) => ({
    flex: 1,
    padding: "14px 18px",
    borderRadius: "12px",
    border: `1px solid ${colors.inputBorder}`,
    background: colors.input,
    color: colors.text,
    fontSize: "15px",
    outline: "none",
    minWidth: 0,
  }),

  /* project list */
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    marginBottom: "8px",
  },
  card: (colors: any, isDark: boolean) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 20px",
    borderRadius: "16px",
    background: colors.cardBg,
    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
    userSelect: "none" as const,
    cursor: "pointer",
    border: `1px solid ${colors.border}`,
    boxShadow: isDark ? "6px 6px 14px rgba(0,0,0,0.5)" : "0 1px 3px rgba(0,0,0,0.08)",
  }),
  cardLeft: { display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 },
  projectEmoji: { fontSize: "20px", flexShrink: 0 },
  projectTitle: (colors: any) => ({
    fontSize: "15px", fontWeight: "500", color: colors.text,
    whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis",
  }),
  renameInput: (colors: any) => ({
    flex: 1, background: colors.input, border: `1px solid ${colors.primary}`,
    borderRadius: "8px", color: colors.text, fontSize: "15px",
    fontWeight: "500", padding: "6px 10px", outline: "none",
    boxShadow: `0 0 0 3px ${colors.primaryLight}`,
  }),
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
  btnPrimary: (colors: any) => ({
    padding: "12px 20px", borderRadius: "12px", border: "none",
    background: colors.primary, color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    boxShadow: "4px 4px 8px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
  }),
  btnSuccess: {
    padding: "12px 20px", borderRadius: "12px", border: "none",
    background: "rgba(16,185,129,0.15)", color: "#10b981", cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    border2: "1px solid rgba(16,185,129,0.25)",
    boxShadow: "4px 4px 8px rgba(0,0,0,0.3)",
    transition: "all 0.2s ease",
  },
  btnOutline: (colors: any) => ({
    padding: "12px 20px", borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    background: "transparent", color: colors.textSecondary, cursor: "pointer",
    fontWeight: "600", fontSize: "14px", whiteSpace: "nowrap" as const,
    transition: "all 0.2s ease",
  }),
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
  empty: (colors: any) => ({
    padding: "28px 20px", borderRadius: "16px", background: colors.surface,
    color: colors.textSecondary, fontSize: "14px", textAlign: "center" as const,
    border: `1px dashed ${colors.border}`,
  }),

  /* modal */
  modalOverlay: {
    position: "fixed" as const, top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000, animation: "fadeIn 0.2s ease",
  },
  modalContent: (colors: any) => ({
    background: colors.surface, padding: "32px", borderRadius: "20px",
    width: "420px", maxWidth: "92vw",
    boxShadow: "0 24px 48px rgba(0,0,0,0.6), inset 1px 1px 0 rgba(255,255,255,0.05)",
    display: "flex", flexDirection: "column" as const, gap: "20px",
  }),
  modalTitle: (colors: any) => ({ fontSize: "20px", fontWeight: "700", color: colors.text, margin: 0 }),
  modalText: (colors: any) => ({ fontSize: "14px", color: colors.textSecondary, margin: 0, lineHeight: "1.6" }),
  modalInput: (colors: any) => ({
    width: "100%", padding: "16px 18px", borderRadius: "12px", border: `1px solid ${colors.inputBorder}`,
    background: colors.input, color: colors.text, outline: "none", fontSize: "15px",
    boxSizing: "border-box" as const,
  }),
  modalButtons: { display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "4px" },

  /* team code display */
  codeDisplay: (colors: any) => ({
    background: colors.input, borderRadius: "12px", padding: "20px",
    textAlign: "center" as const,
    border: `1px solid ${colors.border}`,
  }),
  codeValue: (colors: any) => ({
    fontSize: "28px", fontWeight: "800", letterSpacing: "6px",
    color: colors.primary, fontFamily: "monospace",
  }),
  codeHint: (colors: any) => ({ fontSize: "12px", color: colors.textSecondary, marginTop: "8px" }),

  /* divider */
  divider: (colors: any) => ({
    height: "1px", background: colors.border, margin: "8px 0 24px 0",
  }),
};

/* ─────────────────────────── component ─────────────────────── */
export default function ProjectBoard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = theme.getThemeColors();
  const isDark = theme.mode === 'dark';
  const { isAtLimit, refreshUsage } = useSubscription();
  
  const [personalProjects, setPersonalProjects] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamProjects, setTeamProjects] = useState<Record<number, any[]>>({});
  const [teamMembers, setTeamMembers] = useState<Record<number, any[]>>({});
  const [currentUser, setCurrentUser] = useState<any | null>(null);
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
  const [deleteTeamConfirmId, setDeleteTeamConfirmId] = useState<number | null>(null);
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
        const memberResults = await Promise.all(
          myTeams.map((t: any) => fetchTeamMembers(t.id).catch(() => []))
        );
        const map: Record<number, any[]> = {};
        const membersMap: Record<number, any[]> = {};
        myTeams.forEach((t: any, i: number) => { 
          map[t.id] = results[i]; 
          membersMap[t.id] = memberResults[i];
        });
        setTeamProjects(map);
        setTeamMembers(membersMap);
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

  async function handleDeleteTeam() {
    if (deleteTeamConfirmId === null) return;
    try {
      await deleteTeam(deleteTeamConfirmId);
      setTeams((prev) => prev.filter((t) => t.id !== deleteTeamConfirmId));
      setTeamProjects((prev) => {
        const next = { ...prev };
        delete next[deleteTeamConfirmId];
        return next;
      });
      setAlertMessage("Team and all projects deleted successfully");
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to delete team");
    } finally { setDeleteTeamConfirmId(null); }
  }

  async function handleCreatePersonal() {
    if (!newTitle.trim()) return;
    
    // Check if user is at limit
    if (isAtLimit('personal_projects')) {
      setAlertMessage("Personal project limit reached. Upgrade to Premium for unlimited projects!");
      return;
    }
    
    try {
      const proj = await createProject(newTitle.trim());
      setPersonalProjects((prev) => [...prev, proj]);
      setNewTitle("");
      await refreshUsage(); // Refresh usage stats
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to create project");
    }
  }

  async function handleCreateTeamProject(teamId: number) {
    const title = (teamNewTitle[teamId] || "").trim();
    if (!title) return;
    
    // Check if user is at limit for team projects
    if (isAtLimit('team_projects')) {
      setAlertMessage("Team project limit reached (1 max). Upgrade to Premium for unlimited projects!");
      return;
    }
    
    try {
      const proj = await createProject(title, teamId);
      setTeamProjects((prev) => ({ ...prev, [teamId]: [...(prev[teamId] || []), proj] }));
      setTeamNewTitle((prev) => ({ ...prev, [teamId]: "" }));
      await refreshUsage(); // Refresh usage stats
    } catch (err: any) {
      setAlertMessage(err.message || "Failed to create project");
    }
  }

  async function handleCreateTeam() {
    if (!createTeamName.trim()) return;
    
    // Check if user is at limit
    if (isAtLimit('teams')) {
      setAlertMessage("Team limit reached (1 max). Upgrade to Premium for unlimited teams!");
      return;
    }
    
    setCreateTeamLoading(true);
    try {
      const team = await createTeam(createTeamName.trim());
      setCreatedTeamCode(team.team_code);
      setTeams((prev) => [...prev, team]);
      setTeamProjects((prev) => ({ ...prev, [team.id]: [] }));
      await refreshUsage(); // Refresh usage stats
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
        className="project-card"
        style={{
          ...s.card(colors, isDark),
          background: isHovered ? colors.surfaceHover : colors.cardBg,
          cursor: editingId === p.id ? "default" : "pointer",
        }}
        onClick={() => {
          if (editingId !== p.id) {
            navigate(`/dashboard/${p.id}`, { state: { project: p } });
          }
        }}
        onMouseEnter={() => setHoveredId(p.id)}
        onMouseLeave={() => setHoveredId(null)}
      >
        <div style={s.cardLeft}>
          <span style={s.projectEmoji}>📂</span>
          {editingId === p.id ? (
            <input
              ref={editInputRef}
              style={s.renameInput(colors)}
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename(p.id);
                if (e.key === "Escape") setEditingId(null);
              }}
              onBlur={() => commitRename(p.id)}
            />
          ) : (
            <span style={s.projectTitle(colors)}>{p.title}</span>
          )}
        </div>

        <div style={{ ...s.actions, opacity: isHovered || editingId === p.id ? 1 : 0 }}>
          <button
            title={editingId === p.id ? "Confirm rename" : "Rename"}
            style={{
              ...s.iconBtn,
              background: editingId === p.id ? "rgba(16,185,129,0.15)" : colors.primaryLight,
              color: editingId === p.id ? "#10b981" : colors.primary,
            }}
            onClick={(e) => editingId === p.id ? commitRename(p.id) : startEdit(e, p)}
            onMouseEnter={(e) => { e.currentTarget.style.background = editingId === p.id ? "rgba(16,185,129,0.28)" : `${colors.primary}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = editingId === p.id ? "rgba(16,185,129,0.15)" : colors.primaryLight; }}
          >{editingId === p.id ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          )}</button>

          <button
            title="Delete project"
            style={{ ...s.iconBtn, background: "rgba(255,68,68,0.1)", color: "#ff6b6b" }}
            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(p.id); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,68,68,0.1)"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── JSX ─────────────────────────────────────────────────────── */
  return (
    <div style={s.page(colors)}>
      <style>{`
        input::placeholder { color: ${colors.textSecondary}; }
        
        /* ─────────────────── ANIMATIONS ─────────────────── */
        
        /* Page Load Stagger Animation */
        .project-card {
          animation: cardSlideIn 0.4s ease-out backwards;
        }
        
        .project-card:nth-child(1) { animation-delay: 0ms; }
        .project-card:nth-child(2) { animation-delay: 50ms; }
        .project-card:nth-child(3) { animation-delay: 100ms; }
        .project-card:nth-child(4) { animation-delay: 150ms; }
        .project-card:nth-child(5) { animation-delay: 200ms; }
        .project-card:nth-child(n+6) { animation-delay: 250ms; }
        
        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Project Card Hover Elevation */
        .project-card:hover {
          transform: translateY(-3px);
          box-shadow: ${isDark ? '0 8px 20px rgba(0,0,0,0.5)' : '0 8px 20px rgba(0,0,0,0.12)'} !important;
        }
        
        /* Project Card Glassmorphism */
        .project-card {
          backdrop-filter: blur(2px);
          transition: all 0.2s ease;
        }
        
        .project-card:hover {
          backdrop-filter: blur(4px);
        }
        
        /* Modal Fade In */
        .modal-overlay {
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn { 
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
            backdrop-filter: blur(0px);
          } 
          to { 
            opacity: 1; 
            transform: translateY(0); 
            backdrop-filter: blur(6px);
          } 
        }
        
        /* Button Hover Glow */
        .btn-primary:hover {
          box-shadow: 0 0 12px rgba(11,125,224,0.4);
        }
        
        .btn-success:hover {
          box-shadow: 0 0 12px rgba(16,185,129,0.4);
        }
        
        /* Team Code Badge Pulse */
        .team-code-badge {
          transition: all 0.2s ease;
        }
        
        .team-code-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px rgba(11,125,224,0.3);
        }
        
        /* Empty State Fade */
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
        
        *::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {greeting && <div style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 6 }}>{greeting}</div>}
          <h2 style={s.pageTitle(colors)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Projects
          </h2>
        </div>
        <div style={s.topActions}>
          <SettingsDropdown />

          <button
            style={s.btnOutline(colors)}
            onClick={() => { setShowJoinTeam(true); setJoinCode(""); }}
            onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; e.currentTarget.style.borderColor = colors.border; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.borderColor = colors.border; }}
          >🔗 Join Team</button>

          <button
            style={s.btnSuccess}
            className="btn-success"
            onClick={() => { setShowCreateTeam(true); setCreateTeamName(""); setCreatedTeamCode(null); }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{ marginLeft: '4px' }}>Create Team</span>
          </button>
        </div>
      </div>

      {/* ── Personal Projects ── */}
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle(colors)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          My Projects
        </h3>
        <UsageIndicator type="personal_projects" />
      </div>

      {isAtLimit('personal_projects') && (
        <div style={{ marginBottom: '20px' }}>
          <LimitAlert type="personal_projects" />
        </div>
      )}

      <div style={s.createBar}>
        <input
          style={s.input(colors)}
          placeholder="New personal project…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreatePersonal()}
        />
        <button
          style={s.btnPrimary(colors)}
          className="btn-primary"
          onClick={handleCreatePersonal}
          onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}
        >+ New Project</button>
      </div>

      <div style={s.list}>
        {personalProjects.length === 0
          ? <div style={s.empty(colors)} className="empty-state">No personal projects yet. Create one above!</div>
          : personalProjects.map(renderCard)
        }
      </div>

      {/* ── Team Sections ── */}
      {teams.map((team) => (
        <div key={team.id}>
          <div style={s.divider(colors)} />

          <div style={s.sectionHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={s.sectionTitle(colors)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {team.name}
              </h3>
              <UsageIndicator type="teams" compact />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              {teamMembers[team.id] && teamMembers[team.id].length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontSize: "12px", color: colors.textSecondary }}>Members:</div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {teamMembers[team.id].slice(0, 5).map((m: any, i: number) => (
                      <div
                        key={m.id}
                        title={m.name}
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%",
                          background: `hsl(${(m.id * 67) % 360}, 60%, 45%)`,
                          border: "2px solid #1a1a1a", marginLeft: i === 0 ? "0" : "-8px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: "700", color: "#fff",
                          cursor: "default", zIndex: 10 - i, position: "relative",
                          boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                        }}
                      >
                        {m.name[0].toUpperCase()}
                      </div>
                    ))}
                    {teamMembers[team.id].length > 5 && (
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        background: "#333", border: "2px solid #1a1a1a",
                        marginLeft: "-8px", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "10px", fontWeight: "700",
                        color: "#888", position: "relative",
                      }}>+{teamMembers[team.id].length - 5}</div>
                    )}
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div
                  className="team-code-badge"
                  style={{
                    ...s.teamCodeBadge(colors),
                    background: copiedCode === team.team_code ? "rgba(16,185,129,0.15)" : colors.primaryLight,
                    color: copiedCode === team.team_code ? "#10b981" : colors.primary,
                    borderColor: copiedCode === team.team_code ? "rgba(16,185,129,0.3)" : `${colors.primary}40`,
                  }}
                  title="Click to copy team code"
                  onClick={() => copyCode(team.team_code)}
                  onMouseEnter={(e: any) => { e.currentTarget.style.background = `${colors.primary}30`; }}
                  onMouseLeave={(e: any) => { e.currentTarget.style.background = copiedCode === team.team_code ? "rgba(16,185,129,0.15)" : colors.primaryLight; }}
                >
                  {copiedCode === team.team_code ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Copied!
                    </>
                  ) : `# ${team.team_code}`}
                </div>
                {team.owner_id === (currentUser?.id || null) && (
                  <button
                    style={{
                      padding: "6px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 68, 68, 0.3)",
                      background: "transparent",
                      color: "#ff6b6b",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => setDeleteTeamConfirmId(team.id)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    title="Delete team and all projects"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete Team
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={s.createBar}>
            <input
              style={s.input(colors)}
              placeholder={`New project in ${team.name}…`}
              value={teamNewTitle[team.id] || ""}
              onChange={(e) => setTeamNewTitle((prev) => ({ ...prev, [team.id]: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTeamProject(team.id)}
            />
            <button
              style={s.btnPrimary(colors)}
              className="btn-primary"
              onClick={() => handleCreateTeamProject(team.id)}
              onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}
            >+ Add Project</button>
          </div>

          <div style={s.list}>
            {(teamProjects[team.id] || []).length === 0
              ? <div style={s.empty(colors)} className="empty-state">No projects in this team yet. Add one above!</div>
              : (teamProjects[team.id] || []).map(renderCard)
            }
          </div>
        </div>
      ))}

      {/* ───────────────── MODALS ───────────────── */}

      {/* Delete Confirmation */}
      {deleteConfirmId !== null && (
        <div style={s.modalOverlay} className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div style={s.modalContent(colors)} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle(colors)}>Delete Project</h3>
            <p style={s.modalText(colors)}>Are you sure? This will delete the project and all its tasks. This cannot be undone.</p>
            <div style={s.modalButtons}>
              <button style={s.btnSecondary} onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; }}>Cancel</button>
              <button style={s.btnDanger} onClick={handleDeleteProject}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "none"; }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team Confirmation */}
      {deleteTeamConfirmId !== null && (
        <div style={s.modalOverlay} className="modal-overlay" onClick={() => setDeleteTeamConfirmId(null)}>
          <div style={s.modalContent(colors)} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle(colors)}>Delete Team</h3>
            <p style={s.modalText(colors)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              This will delete the entire team and ALL projects within it. This cannot be undone.
            </p>
            <div style={s.modalButtons}>
              <button style={s.btnSecondary} onClick={() => setDeleteTeamConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; }}>Cancel</button>
              <button style={s.btnDanger} onClick={handleDeleteTeam}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#ff6b6b"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.transform = "none"; }}>Delete Team</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div style={s.modalOverlay} className="modal-overlay" onClick={() => { if (!createdTeamCode) setShowCreateTeam(false); }}>
          <div style={s.modalContent(colors)} onClick={(e) => e.stopPropagation()}>
            {createdTeamCode ? (
              <>
                <h3 style={s.modalTitle(colors)}>✅ Team Created!</h3>
                <p style={s.modalText(colors)}>Share this code with your teammates so they can join:</p>
                <div style={s.codeDisplay(colors)}>
                  <div style={s.codeValue(colors)}>{createdTeamCode}</div>
                  <div style={s.codeHint(colors)}>Click the code badge on your team section to copy anytime</div>
                </div>
                <div style={s.modalButtons}>
                  <button
                    style={s.btnPrimary(colors)}
                    onClick={() => { copyCode(createdTeamCode); setShowCreateTeam(false); setCreatedTeamCode(null); setCreateTeamName(""); }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy & Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 style={s.modalTitle(colors)}>Create a Team</h3>
                <p style={s.modalText(colors)}>Give your team a name. A unique join code will be generated automatically.</p>
                <input
                  style={s.modalInput(colors)}
                  autoFocus
                  placeholder="Team name…"
                  value={createTeamName}
                  onChange={(e) => setCreateTeamName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateTeam(); if (e.key === "Escape") setShowCreateTeam(false); }}
                />
                <div style={s.modalButtons}>
                  <button style={s.btnSecondary} onClick={() => setShowCreateTeam(false)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; }}>Cancel</button>
                  <button
                    style={{ ...s.btnPrimary(colors), opacity: createTeamLoading ? 0.6 : 1 }}
                    onClick={handleCreateTeam}
                    disabled={createTeamLoading}
                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}
                  >{createTeamLoading ? "Creating…" : "Create Team"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Join Team Modal */}
      {showJoinTeam && (
        <div style={s.modalOverlay} className="modal-overlay" onClick={() => setShowJoinTeam(false)}>
          <div style={s.modalContent(colors)} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle(colors)}>Join a Team</h3>
            <p style={s.modalText(colors)}>Enter the team code shared by your teammate (case-insensitive).</p>
            <input
              style={{ ...s.modalInput(colors), letterSpacing: "4px", textTransform: "uppercase", fontFamily: "monospace", fontSize: "18px" }}
              autoFocus
              placeholder="XXXXXXXX"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") handleJoinTeam(); if (e.key === "Escape") setShowJoinTeam(false); }}
              maxLength={8}
            />
            <div style={s.modalButtons}>
              <button style={s.btnSecondary} onClick={() => setShowJoinTeam(false)}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; }}>Cancel</button>
              <button
                style={{ ...s.btnPrimary(colors), opacity: joinLoading ? 0.6 : 1 }}
                onClick={handleJoinTeam}
                disabled={joinLoading}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}
              >{joinLoading ? "Joining…" : "🔗 Join Team"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertMessage !== null && (
        <div style={s.modalOverlay} className="modal-overlay" onClick={() => setAlertMessage(null)}>
          <div style={s.modalContent(colors)} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle(colors)}>Notice</h3>
            <p style={s.modalText(colors)}>{alertMessage}</p>
            <div style={s.modalButtons}>
              <button style={s.btnPrimary(colors)} onClick={() => setAlertMessage(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary; }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
