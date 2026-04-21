import { X, MessageSquare, Users, Plus, FolderOpen, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchProjects, fetchTeams, createProject } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface Project {
  id: number;
  title: string;
  team_id?: number | null;
}

interface Team {
  id: number;
  name: string;
  team_code: string;
  owner_id: number;
}

interface QuickAccessPanelProps {
  type: 'chat' | 'teams' | 'newProject' | 'none';
  onClose: () => void;
}

export function QuickAccessPanel({ type, onClose }: QuickAccessPanelProps) {
  const navigate = useNavigate();
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (type !== 'none') {
      loadData();
    }
  }, [type]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (type === 'chat' || type === 'newProject') {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      }
      if (type === 'teams') {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim() || creating) return;
    
    setCreating(true);
    try {
      const newProject = await createProject(newProjectTitle.trim());
      navigate(`/dashboard/${newProject.id}`);
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (type === 'none') return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        onClick={onClose}
        style={{ animation: 'fadeIn 150ms ease-out' }}
      />

      {/* Panel */}
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,640px)] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl z-[1001] overflow-hidden"
        style={{ animation: 'scaleIn 200ms ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            {type === 'chat' && (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <MessageSquare className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">Open Chat</h2>
              </>
            )}
            {type === 'teams' && (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <Users className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">Your Teams</h2>
              </>
            )}
            {type === 'newProject' && (
              <>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryLight }}
                >
                  <Plus className="w-4 h-4" style={{ color: colors.primary }} />
                </div>
                <h2 className="text-lg font-semibold text-zinc-100">Create Project</h2>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[min(78vh,560px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div 
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
              ></div>
            </div>
          ) : (
            <>
              {/* Chat - Select Project */}
              {type === 'chat' && (
                <div className="p-4 sm:p-6">
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 mb-4">No projects yet</p>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/board');
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: colors.primaryLight,
                          color: colors.primary
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Create your first project
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-zinc-400 mb-4">Select a project to open chat</p>
                      <div className="space-y-2.5">
                        {projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              navigate(`/chat/${project.id}`);
                              onClose();
                            }}
                            className="w-full flex items-center justify-between p-3.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 transition-all group"
                            style={{
                              borderColor: undefined
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.primary + '80'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.5)'}
                          >
                            <div className="flex items-center gap-3">
                              <FolderOpen 
                                className="w-4 h-4 text-zinc-400 transition-colors" 
                                style={{ color: undefined }}
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                              />
                              <span className="text-sm font-medium text-zinc-200">{project.title}</span>
                            </div>
                            <ArrowRight 
                              className="w-4 h-4 text-zinc-600 transition-colors"
                              style={{ color: undefined }}
                              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Teams List */}
              {type === 'teams' && (
                <div className="p-4 sm:p-6">
                  {teams.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                      <p className="text-sm text-zinc-400 mb-4">No teams yet</p>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/board');
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                          backgroundColor: colors.primaryLight,
                          color: colors.primary
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        Create or join a team
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-zinc-400 mb-4">Manage your teams</p>
                      <div className="space-y-3">
                        {teams.map((team) => (
                          <div
                            key={team.id}
                            className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-sm font-semibold text-zinc-100 mb-1">{team.name}</h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-zinc-500">Code:</span>
                                  <code 
                                    className="text-xs font-mono bg-zinc-900/50 px-2 py-0.5 rounded"
                                    style={{ color: colors.primary }}
                                  >
                                    {team.team_code}
                                  </code>
                                </div>
                              </div>
                              {team.owner_id && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
                                  <Crown className="w-3 h-3 text-amber-400" />
                                  <span className="text-xs text-amber-400 font-medium">Owner</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                onClose();
                                navigate('/board');
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100 text-xs font-medium transition-colors"
                            >
                              View Projects
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          navigate('/board');
                        }}
                        className="w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        style={{
                          backgroundColor: colors.primaryLight,
                          color: colors.primary
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Plus className="w-4 h-4" />
                        Create New Team
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* New Project */}
              {type === 'newProject' && (
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                      placeholder="Enter project name..."
                      autoFocus
                      className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100 text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateProject}
                      disabled={!newProjectTitle.trim() || creating}
                      className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: colors.primary
                      }}
                      onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {creating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Create Project
                        </>
                      )}
                    </button>
                  </div>

                  {projects.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <p className="text-xs text-zinc-500 mb-3">Or open existing project:</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {projects.slice(0, 5).map((project) => (
                          <button
                            key={project.id}
                            onClick={() => {
                              navigate(`/dashboard/${project.id}`);
                              onClose();
                            }}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-left transition-colors group"
                          >
                            <FolderOpen 
                              className="w-3.5 h-3.5 text-zinc-500 transition-colors" 
                              style={{ color: undefined }}
                              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                            />
                            <span className="text-xs text-zinc-400 group-hover:text-zinc-200 truncate">{project.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
