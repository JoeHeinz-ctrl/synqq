import { Check, Circle, Clock, User, Calendar, Trash2, Edit, MoreHorizontal, Flag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
  due_date?: string;
  assigned_user_id?: number;
  created_at?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface TaskListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  onDeleteTask: (e: React.MouseEvent, taskId: number) => void;
  onEditTask: (taskId: number) => void;
  selectedTaskId: number | null;
}

export function TaskListView({ 
  tasks, 
  onTaskClick, 
  onDeleteTask, 
  onEditTask,
  selectedTaskId 
}: TaskListViewProps) {
  const theme = useTheme();
  const isDark = theme.mode === 'dark';
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('done') || normalizedStatus.includes('completed')) {
      return <Check className="w-4 h-4 text-emerald-500" />;
    }
    if (normalizedStatus.includes('doing') || normalizedStatus.includes('progress') || normalizedStatus.includes('active')) {
      return <Clock className="w-4 h-4 text-amber-500" />;
    }
    return <Circle className="w-4 h-4 text-zinc-400" />;
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('done') || normalizedStatus.includes('completed')) {
      return {
        bg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
        text: isDark ? 'text-emerald-400' : 'text-emerald-700',
        border: isDark ? 'border-emerald-500/20' : 'border-emerald-200',
        dot: isDark ? 'bg-emerald-400' : 'bg-emerald-500'
      };
    }
    if (normalizedStatus.includes('doing') || normalizedStatus.includes('progress') || normalizedStatus.includes('active')) {
      return {
        bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50',
        text: isDark ? 'text-amber-400' : 'text-amber-700',
        border: isDark ? 'border-amber-500/20' : 'border-amber-200',
        dot: isDark ? 'bg-amber-400' : 'bg-amber-500'
      };
    }
    return {
      bg: isDark ? 'bg-zinc-500/10' : 'bg-zinc-100',
      text: isDark ? 'text-zinc-400' : 'text-zinc-600',
      border: isDark ? 'border-zinc-500/20' : 'border-zinc-300',
      dot: isDark ? 'bg-zinc-400' : 'bg-zinc-500'
    };
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium':
        return isDark ? 'text-amber-400' : 'text-amber-600';
      case 'low':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-zinc-500' : 'text-zinc-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
          isDark ? 'bg-zinc-800/50' : 'bg-zinc-100'
        }`}>
          <Circle className={`w-10 h-10 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
        </div>
        <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
          No tasks yet
        </h3>
        <p className={`text-sm max-w-sm ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
          Create your first task to get started with organizing your project
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const statusBadge = getStatusBadge(task.status);
        const isHovered = hoveredTaskId === task.id;
        const isSelected = selectedTaskId === task.id;
        
        return (
          <div
            key={task.id}
            onClick={() => onTaskClick(task.id)}
            onMouseEnter={() => setHoveredTaskId(task.id)}
            onMouseLeave={() => setHoveredTaskId(null)}
            className={`
              group relative flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 cursor-pointer
              ${isSelected 
                ? isDark
                  ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border-teal-500/30 shadow-xl shadow-teal-500/5 ring-1 ring-teal-500/20'
                  : 'bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-300 shadow-lg shadow-teal-100 ring-1 ring-teal-200'
                : isHovered
                  ? isDark 
                    ? 'bg-zinc-800/70 border-zinc-700/70 shadow-xl shadow-black/20 transform -translate-y-0.5' 
                    : 'bg-white border-zinc-300 shadow-xl shadow-zinc-200/50 transform -translate-y-0.5'
                  : isDark 
                    ? 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/70' 
                    : 'bg-white/80 border-zinc-200 hover:border-zinc-300'
              }
            `}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className={`
                w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                ${isSelected 
                  ? isDark ? 'bg-teal-500/20' : 'bg-teal-100' 
                  : isDark ? 'bg-zinc-800/50 group-hover:bg-zinc-700/70' : 'bg-zinc-100 group-hover:bg-zinc-200'
                }
              `}>
                {getStatusIcon(task.status)}
              </div>
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and Status Row */}
              <div className="flex items-start justify-between gap-4">
                <h3 className={`
                  font-semibold text-base leading-tight flex-1
                  ${isDark 
                    ? isSelected ? 'text-teal-100' : 'text-zinc-100' 
                    : isSelected ? 'text-teal-900' : 'text-zinc-900'
                  }
                `}>
                  {task.title}
                </h3>
                
                <span className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border flex-shrink-0
                  ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}
                `}>
                  <div className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></div>
                  {task.status}
                </span>
              </div>

              {/* Description */}
              {task.description && (
                <p className={`
                  text-sm leading-relaxed line-clamp-2
                  ${isDark 
                    ? isSelected ? 'text-zinc-300' : 'text-zinc-400' 
                    : isSelected ? 'text-zinc-700' : 'text-zinc-600'
                  }
                `}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  {task.due_date && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark 
                        ? 'bg-zinc-800/50 text-zinc-400' 
                        : 'bg-zinc-100 text-zinc-600'
                      }
                    `}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">{formatDate(task.due_date)}</span>
                    </div>
                  )}
                  
                  {task.assigned_user_id && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark 
                        ? 'bg-zinc-800/50 text-zinc-400' 
                        : 'bg-zinc-100 text-zinc-600'
                      }
                    `}>
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">Assigned</span>
                    </div>
                  )}

                  {task.priority && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                      ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-100'}
                    `}>
                      <Flag className={`w-3.5 h-3.5 ${getPriorityColor(task.priority)}`} />
                      <span className={`font-medium capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={`
                  flex items-center gap-1 transition-all duration-200
                  ${isHovered || isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}
                `}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task.id);
                    }}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isDark 
                        ? 'hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-100' 
                        : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                      }
                    `}
                    title="Edit task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => onDeleteTask(e, task.id)}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isDark
                        ? 'hover:bg-red-500/10 text-zinc-400 hover:text-red-400'
                        : 'hover:bg-red-50 text-zinc-500 hover:text-red-600'
                      }
                    `}
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className={`
                      p-2 rounded-lg transition-all duration-200
                      ${isDark 
                        ? 'hover:bg-zinc-700/70 text-zinc-400 hover:text-zinc-100' 
                        : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700'
                      }
                    `}
                    title="More options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className={`
                absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full shadow-lg
                ${isDark 
                  ? 'bg-gradient-to-b from-teal-500 to-cyan-600 shadow-teal-500/50' 
                  : 'bg-gradient-to-b from-teal-500 to-cyan-600 shadow-teal-500/30'
                }
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}
