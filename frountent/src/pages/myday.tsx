import { useEffect, useState } from 'react';
import { 
  Plus, 
  Check, 
  Circle, 
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'myday_tasks';
const DATE_KEY = 'myday_date';

export default function MyDay() {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [completedExpanded, setCompletedExpanded] = useState(true);

  // Get current date string (YYYY-MM-DD)
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Load tasks and check if date has changed
  useEffect(() => {
    const storedDate = localStorage.getItem(DATE_KEY);
    const currentDate = getCurrentDate();

    // If date has changed, clear tasks
    if (storedDate !== currentDate) {
      localStorage.setItem(DATE_KEY, currentDate);
      localStorage.removeItem(STORAGE_KEY);
      setTasks([]);
    } else {
      // Load tasks for today
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        try {
          setTasks(JSON.parse(storedTasks));
        } catch (error) {
          console.error('Failed to parse tasks:', error);
          setTasks([]);
        }
      }
    }
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  // Get current date info
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long',
    day: 'numeric'
  });

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-zinc-50 to-zinc-100'} ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>My Day</h1>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>{dateString}</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mb-6 ${
              isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-white border-zinc-200 shadow-sm'
            }`}>
              <Sparkles className={`w-10 h-10 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            </div>
            <h2 className={`text-2xl font-semibold mb-3 ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Start your day
            </h2>
            <p className={`max-w-md mb-8 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
              Add tasks to focus on today. Your list resets each day for a fresh start.
            </p>
            <div className="w-full max-w-md">
              <div className={`flex items-center gap-3 p-4 rounded-xl border ${
                isDark 
                  ? 'bg-zinc-900/50 border-zinc-800/50' 
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <Plus className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
                <input
                  type="text"
                  placeholder="Add your first task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className={`flex-1 bg-transparent outline-none text-[15px] ${
                    isDark 
                      ? 'text-zinc-100 placeholder-zinc-600' 
                      : 'text-zinc-900 placeholder-zinc-400'
                  }`}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="space-y-8">
            {/* Active Tasks */}
            {activeTasks.length > 0 && (
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      isDark
                        ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50'
                        : 'bg-white border-zinc-200 hover:border-teal-300 hover:shadow-md'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                        isDark
                          ? 'border-zinc-600 hover:border-teal-500'
                          : 'border-zinc-400 hover:border-teal-500'
                      }`}
                    >
                      <Circle className="w-3 h-3 text-transparent" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-[15px] leading-snug ${
                        isDark ? 'text-zinc-200' : 'text-zinc-800'
                      }`}>
                        {task.title}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all text-xs ${
                        isDark
                          ? 'hover:bg-zinc-800 text-zinc-500 hover:text-red-400'
                          : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
                      }`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => setCompletedExpanded(!completedExpanded)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isDark 
                      ? 'text-zinc-500 hover:text-zinc-400' 
                      : 'text-zinc-600 hover:text-zinc-700'
                  }`}
                >
                  {completedExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span>Completed ({completedTasks.length})</span>
                </button>

                {completedExpanded && (
                  <div className="space-y-2">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group flex items-center gap-4 p-4 rounded-xl border opacity-60 ${
                          isDark
                            ? 'bg-zinc-900/20 border-zinc-800/30'
                            : 'bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-500 border-2 border-teal-500 transition-colors flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-[15px] leading-snug line-through ${
                            isDark ? 'text-zinc-500' : 'text-zinc-500'
                          }`}>
                            {task.title}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className={`flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all text-xs ${
                            isDark
                              ? 'hover:bg-zinc-800 text-zinc-600 hover:text-red-400'
                              : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
                          }`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Task Input */}
            <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
              isDark
                ? 'bg-zinc-900/30 border-zinc-800/50 hover:bg-zinc-900/50 hover:border-zinc-700/50'
                : 'bg-white border-zinc-200 hover:border-teal-300 hover:shadow-md'
            }`}>
              <Plus className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
              <input
                type="text"
                placeholder="Add a task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className={`flex-1 bg-transparent outline-none text-[15px] ${
                  isDark 
                    ? 'text-zinc-100 placeholder-zinc-600' 
                    : 'text-zinc-900 placeholder-zinc-400'
                }`}
              />
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 gap-4 pt-8 ${isDark ? 'border-t border-zinc-900' : 'border-t border-zinc-200'}`}>
              <div className={`p-4 rounded-xl border ${
                isDark 
                  ? 'bg-zinc-900/30 border-zinc-800/50' 
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {activeTasks.length}
                </div>
                <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  Remaining
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border ${
                isDark 
                  ? 'bg-zinc-900/30 border-zinc-800/50' 
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                  {completedTasks.length}
                </div>
                <div className={`text-xs uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  Completed
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
