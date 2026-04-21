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
  Sun,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { StatCard } from '../components/layout/StatCard';
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
        'min-h-screen',
        isDark
          ? 'bg-[#0a0a0a]'
          : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'
      )}
    >
      <PageContainer>
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: colors.primary }}
            >
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={cn(
                  'text-4xl font-bold',
                  isDark ? 'text-zinc-100' : 'text-zinc-900'
                )}
              >
                My Day
              </h1>
              <p
                className={cn(
                  'text-sm mt-1',
                  isDark ? 'text-zinc-500' : 'text-zinc-600'
                )}
              >
                {dateString}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          {tasks.length > 0 && (
            <div className="flex items-center gap-4">
              <StatCard
                label="Remaining"
                value={activeTasks.length}
                variant="default"
                className="min-w-[140px]"
              />
              <StatCard
                label="Completed"
                value={completedTasks.length}
                variant="primary"
                className="min-w-[140px]"
              />
            </div>
          )}
        </div>

        {/* ── Add Task Input ── */}
        <div
          className={cn(
            'mb-8 flex items-center gap-3 px-5 py-4 rounded-xl border transition-all',
            isDark
              ? 'bg-zinc-900/40 border-zinc-800/50 focus-within:bg-zinc-900/60'
              : 'bg-white border-zinc-200 shadow-sm focus-within:shadow-md'
          )}
          style={{
            borderColor: undefined
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = colors.primary + '60'}
          onBlur={(e) => e.currentTarget.style.borderColor = ''}
        >
          <Plus
            className={cn(
              'w-5 h-5 flex-shrink-0',
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            )}
          />
          <input
            type="text"
            placeholder="Add a task for today..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className={cn(
              'flex-1 bg-transparent outline-none text-base',
              isDark
                ? 'text-zinc-100 placeholder-zinc-600'
                : 'text-zinc-900 placeholder-zinc-400'
            )}
          />
          {newTaskTitle.trim() && (
            <button
              onClick={addTask}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 text-white',
                isDark ? 'shadow-sm' : 'shadow-md'
              )}
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Add
            </button>
          )}
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
          <div className="space-y-3">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="space-y-3">
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

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-3 mt-6">
                <button
                  onClick={() => setCompletedExpanded((v) => !v)}
                  className={cn(
                    'flex items-center gap-2 text-sm font-semibold transition-colors',
                    isDark
                      ? 'text-zinc-500 hover:text-zinc-400'
                      : 'text-zinc-600 hover:text-zinc-700'
                  )}
                >
                  {completedExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Completed ({completedTasks.length})
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
        'group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all',
        muted ? 'opacity-60' : '',
        isDark
          ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50'
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

      {/* Title */}
      <p
        className={cn(
          'flex-1 text-base leading-relaxed',
          task.completed ? 'line-through' : '',
          isDark
            ? task.completed
              ? 'text-zinc-500'
              : 'text-zinc-200'
            : task.completed
            ? 'text-zinc-500'
            : 'text-zinc-800'
        )}
      >
        {task.title}
      </p>

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className={cn(
          'flex-shrink-0 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all',
          isDark
            ? 'hover:bg-zinc-800 text-zinc-500 hover:text-red-400'
            : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
        )}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
