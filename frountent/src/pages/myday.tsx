import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Star, 
  Check, 
  Circle, 
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { fetchProjects } from '../services/api';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
}

export default function MyDay() {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Get current date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user's projects (for future use)
        await fetchProjects();
        
        // Mock tasks for demonstration
        const mockProjects: Project[] = [
          {
            id: 1,
            title: 'Personal Tasks',
            tasks: [
              { id: 1, title: 'Review project proposals', completed: false, priority: 'high' },
              { id: 2, title: 'Update team on progress', completed: false, priority: 'medium' },
              { id: 3, title: 'Prepare presentation slides', completed: false, priority: 'low' }
            ]
          },
          {
            id: 2,
            title: 'Work Projects',
            tasks: [
              { id: 4, title: 'Deploy the fe with renamed landing page by tomorrow', completed: true },
              { id: 5, title: 'Fix authentication bug', completed: false, priority: 'high' },
              { id: 6, title: 'Code review for new features', completed: false, priority: 'medium' }
            ]
          }
        ];
        
        setProjects(mockProjects);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeTasks = projects.flatMap(p => 
    p.tasks.filter(t => !t.completed).map(t => ({ ...t, project: p.title }))
  );
  
  const completedTasks = projects.flatMap(p => 
    p.tasks.filter(t => t.completed).map(t => ({ ...t, project: p.title }))
  );

  const toggleTask = (taskId: number) => {
    setProjects(prev => prev.map(project => ({
      ...project,
      tasks: project.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    })));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      priority: 'medium'
    };

    setProjects(prev => {
      const personalProject = prev.find(p => p.title === 'Personal Tasks');
      if (personalProject) {
        return prev.map(p => 
          p.title === 'Personal Tasks' 
            ? { ...p, tasks: [...p.tasks, newTask] }
            : p
        );
      } else {
        return [...prev, {
          id: Date.now(),
          title: 'Personal Tasks',
          tasks: [newTask]
        }];
      }
    });
    
    setNewTaskTitle('');
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-amber-400';
      case 'low': return 'text-green-400';
      default: return 'text-zinc-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Day</h1>
            <p className="text-emerald-200 text-lg">{dateString}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/board')}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              title="View all projects"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
              <Clock className="w-5 h-5" />
            </button>
            <button className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="space-y-3 mb-8">
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-200"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-white/40 hover:border-white/60 transition-colors flex items-center justify-center"
              >
                <Circle className="w-4 h-4 text-white/60" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-lg leading-tight mb-1">
                  {task.title}
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-emerald-200">{task.project}</span>
                  {task.priority && (
                    <span className={`${getPriorityColor(task.priority)} capitalize`}>
                      {task.priority} priority
                    </span>
                  )}
                </div>
              </div>

              <button className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                <Star className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-8">
            <button
              onClick={() => setCompletedExpanded(!completedExpanded)}
              className="flex items-center gap-2 mb-4 text-emerald-200 hover:text-white transition-colors"
            >
              {completedExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
              <span className="font-medium">Completed {completedTasks.length}</span>
            </button>

            {completedExpanded && (
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-center gap-4 p-4 rounded-2xl bg-black/10 backdrop-blur-sm border border-white/5 opacity-75"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-500 transition-colors flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white/70 font-medium text-lg leading-tight line-through mb-1">
                        {task.title}
                      </h3>
                      <span className="text-emerald-200/70 text-sm">{task.project}</span>
                    </div>

                    <button className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/60 transition-all opacity-0 group-hover:opacity-100">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Task */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-all duration-200">
          <Plus className="w-6 h-6 text-white/60 flex-shrink-0" />
          <input
            type="text"
            placeholder="Add a task"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="flex-1 bg-transparent text-white placeholder-white/50 text-lg outline-none"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{activeTasks.length}</div>
            <div className="text-emerald-200">Tasks remaining</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{completedTasks.length}</div>
            <div className="text-emerald-200">Tasks completed</div>
          </div>
          
          <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">{projects.length}</div>
            <div className="text-emerald-200">Active projects</div>
          </div>
        </div>
      </div>
    </div>
  );
}