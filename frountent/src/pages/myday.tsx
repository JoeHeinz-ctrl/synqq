import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  Check,
  Circle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Trash2,
  Star,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'myday_tasks';
const DATE_KEY = 'myday_date';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

export default function MyDay() {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [completedExpanded, setCompletedExpanded] = useState(true);

  // Daily reset logic
  useEffect(() => {
    const storedDate = localStorage.getItem(DATE_KEY);
    const currentDate = getCurrentDate();

    if (storedDate !== currentDate) {
      localStorage.setItem(DATE_KEY, currentDate);
      localStorage.removeItem(STORAGE_KEY);
      setTasks([]);
    } else {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch {
          setTasks([]);
        }
      }
    }
  }, []);

  // Persist tasks
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className={cn(
        'min-h-screen relative overflow-hidden pb-28',
        isDark
          ? 'bg-[#040b0a]'
          : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
      )}
    >
      {isDark && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(22,163,74,0.3),transparent_40%),radial-gradient(circle_at_80%_75%,rgba(34,197,94,0.26),transparent_45%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(2,10,8,0.35)_0%,rgba(3,10,7,0.72)_45%,rgba(1,8,6,0.8)_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.14] bg-[linear-gradient(32deg,transparent_0%,transparent_45%,rgba(255,255,255,0.7)_46%,transparent_47%,transparent_100%)] bg-[length:120px_120px]" />
        </>
      )}
      <PageContainer>
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1
                className={cn(
                  'text-5xl font-bold leading-none',
                  isDark ? 'text-zinc-100 drop-shadow-[0_8px_30px_rgba(0,0,0,0.55)]' : 'text-zinc-900'
                )}
              >
                My Day
              </h1>
              <p
                className={cn(
                  'text-2sm mt-2',
                  isDark ? 'text-zinc-300/90' : 'text-zinc-600'
                )}
              >
                {dateString}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className={cn("inline-flex items-center justify-center w-10 h-10 rounded-md border", isDark ? "bg-black/35 border-white/10 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700")}>
                <Star className="w-4 h-4" />
              </button>
              <button className={cn("inline-flex items-center justify-center w-10 h-10 rounded-md border", isDark ? "bg-black/35 border-white/10 text-zinc-300" : "bg-white border-zinc-200 text-zinc-700")}>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Empty State ── */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className={cn(
                'w-24 h-24 rounded-2xl flex items-center justify-center mb-6',
                isDark
                  ? 'bg-zinc-900/50 border border-zinc-800/50'
                  : 'bg-white border border-zinc-200 shadow-lg'
              )}
            >
              <Sparkles
                className={cn(
                  'w-12 h-12',
                  isDark ? 'text-zinc-600' : 'text-zinc-400'
                )}
              />
            </div>
            <h2
              className={cn(
                'text-2xl font-bold mb-3',
                isDark ? 'text-zinc-300' : 'text-zinc-800'
              )}
            >
              Start your day fresh
            </h2>
            <p
              className={cn(
                'text-base max-w-sm',
                isDark ? 'text-zinc-500' : 'text-zinc-600'
              )}
            >
              Add tasks above to focus on today. Your list resets each morning.
            </p>
          </div>
        )}

        {/* ── Task List ── */}
        {tasks.length > 0 && (
          <div className="space-y-2.5">
            {activeTasks.length > 0 && (
              <div className="space-y-2.5">
                {activeTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isDark={isDark}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-2.5 mt-3">
                <button
                  onClick={() => setCompletedExpanded((v) => !v)}
                  className={cn(
                    'w-fit flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-semibold transition-colors',
                    isDark
                      ? 'bg-black/45 border-white/10 text-zinc-300 hover:text-zinc-100'
                      : 'text-zinc-600 hover:text-zinc-700'
                  )}
                >
                  {completedExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Completed {completedTasks.length}
                </button>

                {completedExpanded && (
                  <div className="space-y-3">
                    {completedTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        isDark={isDark}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        muted
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6 lg:px-10 pointer-events-none">
          <div className="max-w-[1320px] mx-auto">
            <div
              className={cn(
                'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-md border backdrop-blur-xl',
                isDark ? 'bg-black/45 border-white/10' : 'bg-white border-zinc-200'
              )}
            >
              <Plus className={cn('w-5 h-5 flex-shrink-0', isDark ? 'text-zinc-300' : 'text-zinc-500')} />
              <input
                type="text"
                placeholder="Add a task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className={cn(
                  'flex-1 bg-transparent outline-none text-lg',
                  isDark ? 'text-zinc-100 placeholder-zinc-400' : 'text-zinc-900 placeholder-zinc-500'
                )}
              />
              {newTaskTitle.trim() && (
                <button
                  onClick={addTask}
                  className="px-4 py-2 rounded-md text-sm font-semibold text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

// ── TaskRow ──────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  isDark: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  muted?: boolean;
}

function TaskRow({ task, isDark, onToggle, onDelete, muted = false }: TaskRowProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3 rounded-md border transition-all',
        muted ? 'opacity-60' : '',
        isDark
          ? 'bg-[#2a2a2a]/90 border-white/10 hover:bg-[#323232]/95'
          : 'bg-white border-zinc-200 hover:shadow-md'
      )}
      style={{
        borderColor: undefined
      }}
      onMouseEnter={(e) => !muted && (e.currentTarget.style.borderColor = colors.primary + '40')}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
          task.completed
            ? ''
            : isDark
            ? 'border-zinc-600 hover:bg-zinc-800'
            : 'border-zinc-400 hover:bg-zinc-50'
        )}
        style={task.completed ? {
          backgroundColor: colors.primary,
          borderColor: colors.primary
        } : undefined}
        onMouseEnter={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.backgroundColor = colors.primaryLight;
          } else {
            e.currentTarget.style.opacity = '0.8';
          }
        }}
        onMouseLeave={(e) => {
          if (!task.completed) {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.backgroundColor = '';
          } else {
            e.currentTarget.style.opacity = '1';
          }
        }}
      >
        {task.completed ? (
          <Check className="w-3.5 h-3.5 text-white" />
        ) : (
          <Circle className="w-3 h-3 text-transparent" />
        )}
      </button>

      <div className="flex-1">
        <p
          className={cn(
            'text-xl leading-tight',
            task.completed ? 'line-through' : '',
            isDark ? (task.completed ? 'text-zinc-500' : 'text-zinc-100') : (task.completed ? 'text-zinc-500' : 'text-zinc-800')
          )}
        >
          {task.title}
        </p>
        <p className={cn('text-sm mt-0.5', isDark ? 'text-zinc-400' : 'text-zinc-600')}>Tasks</p>
      </div>
      <button className={cn('p-1.5 rounded-md', isDark ? 'text-zinc-300 hover:bg-white/5' : 'text-zinc-500 hover:bg-zinc-100')}>
        <Star className="w-5 h-5" />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className={cn(
          'p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all',
          isDark ? 'text-zinc-500 hover:text-red-400 hover:bg-white/5' : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
