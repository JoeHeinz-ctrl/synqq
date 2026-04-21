import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Plus, 
  Check, 
  Circle, 
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Sun,
  Trash2
} from 'lucide-react';

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

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

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
        } catch (error) {
          console.error('Failed to parse tasks:', error);
          setTasks([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

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
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a]' : 'bg-gradient-to-br from-zinc-50 via-white to-zinc-100'}`}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-teal-500 to-cyan-600' 
                : 'bg-gradient-to-br from-teal-400 to-cyan-500'
            } shadow-lg`}>
              {isDark ? <Sun className="w-6 h-6 text-white" /> : <Calendar className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                My Day
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                {dateString}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          {tasks.length > 0 && (
            <div className="flex items-center gap-4 mt-6">
              <div className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-zinc-900/50 border border-zinc-800/50' : 'bg-white border border-zinc-200 shadow-sm'
              }`}>
                <span className={`text-2xl font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  {activeTasks.length}
                </span>
                <span className={`text-xs ml-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  remaining
                </span>
              </div>
              <div className={`px-4 py-2 rounded-lg ${
                isDark ? 'bg-zinc-900/50 border border-zinc-800/50' : 'bg-white border border-zinc-200 shadow-sm'
              }`}>
                <span className={`text-2xl font-bold ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>
                  {completedTasks.length}
                </span>
                <span className={`text-xs ml-2 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  completed
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-6 ${
              isDark 
                ? 'bg-zinc-900/50 border border-zinc-800/50' 
                : 'bg-white border border-zinc-200 shadow-lg'
            }`}>
              <Sparkles className={`w-12 h-12 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            </div>
            <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>
              Start your day fresh
            </h2>
            <p className={`text-base max-w-md mb-10 ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>
              Add tasks to focus on today. Your list automatically resets each day for a clean start.
            </p>
          </div>
        )}

        {/* Add Task Input */}
        <div className={`mb-6 ${
          isDark 
            ? 'bg-zinc-900/30 border border-zinc-800/50' 
            : 'bg-white border border-zinc-200 shadow-md'
        } rounded-xl p-4 transition-all hover:shadow-lg`}>
          <div className="flex items-center gap-3">
            <Plus className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="text"
              placeholder="Add a task for today..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className={`flex-1 bg-transparent outline-none text-base ${
                isDark 
                  ? 'text-zinc-100 placeholder-zinc-600' 
                  : 'text-zinc-900 placeholder-zinc-400'
              }`}
              autoFocus={tasks.length === 0}
            />
            {newTaskTitle.trim() && (
              <button
                onClick={addTask}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isDark
                    ? 'bg-teal-500/10 text-teal-400 hover:bg-teal-500/20'
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                Add
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 && (
          <div className="space-y-6">
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
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                        isDark
                          ? 'border-zinc-600 hover:border-teal-500 hover:bg-teal-500/10'
                          : 'border-zinc-400 hover:border-teal-500 hover:bg-teal-50'
                      }`}
                    >
                      <Circle className="w-3 h-3 text-transparent" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-base leading-relaxed ${
                        isDark ? 'text-zinc-200' : 'text-zinc-800'
                      }`}>
                        {task.title}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${
                        isDark
                          ? 'hover:bg-zinc-800 text-zinc-500 hover:text-red-400'
                          : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
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
                  className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
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
                          className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 border-2 border-teal-500 transition-all flex items-center justify-center hover:bg-teal-600 hover:border-teal-600"
                        >
                          <Check className="w-4 h-4 text-white" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-base leading-relaxed line-through ${
                            isDark ? 'text-zinc-500' : 'text-zinc-500'
                          }`}>
                            {task.title}
                          </p>
                        </div>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className={`flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all ${
                            isDark
                              ? 'hover:bg-zinc-800 text-zinc-600 hover:text-red-400'
                              : 'hover:bg-red-50 text-zinc-400 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
