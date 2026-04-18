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
    return <Circle className="w-4 h-4 text-zinc-500" />;
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('done') || normalizedStatus.includes('completed')) {
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/20',
        dot: 'bg-emerald-500'
      };
    }
    if (normalizedStatus.includes('doing') || normalizedStatus.includes('progress') || normalizedStatus.includes('active')) {
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        border: 'border-amber-500/20',
        dot: 'bg-amber-500'
      };
    }
    return {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-500',
      border: 'border-zinc-500/20',
      dot: 'bg-zinc-500'
    };
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-zinc-500';
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
        <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
          <Circle className="w-10 h-10 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-300 mb-3">No tasks yet</h3>
        <p className="text-sm text-zinc-500 max-w-sm">
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
              group relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 cursor-pointer
              ${isSelected 
                ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/20' 
                : isHovered
                  ? isDark 
                    ? 'bg-zinc-800/70 border-zinc-700/70 shadow-xl shadow-black/20 transform -translate-y-0.5' 
                    : 'bg-white/80 border-zinc-300/70 shadow-xl shadow-black/10 transform -translate-y-0.5'
                  : isDark 
                    ? 'bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/70' 
                    : 'bg-white/50 border-zinc-200/50 hover:border-zinc-300/70'
              }
            `}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className={`
                w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200
                ${isSelected ? 'bg-blue-500/20' : 'bg-zinc-800/50 group-hover:bg-zinc-700/70'}
              `}>
                {getStatusIcon(task.status)}
              </div>
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title and Status */}
              <div className="flex items-start justify-between gap-3">
                <h3 className={`
                  font-semibold text-base leading-tight
                  ${isDark ? 'text-zinc-100' : 'text-zinc-900'}
                  ${isSelected ? 'text-blue-100' : ''}
                `}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border
                    ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}
                  `}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`}></div>
                    {task.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p className={`
                  text-sm leading-relaxed line-clamp-2
                  ${isDark ? 'text-zinc-400' : 'text-zinc-600'}
                  ${isSelected ? 'text-zinc-300' : ''}
                `}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  {task.due_date && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      ${isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-100/50 text-zinc-600'}
                    `}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">{formatDate(task.due_date)}</span>
                    </div>
                  )}
                  
                  {task.assigned_user_id && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      ${isDark ? 'bg-zinc-800/50 text-zinc-400' : 'bg-zinc-100/50 text-zinc-600'}
                    `}>
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">Assigned</span>
                    </div>
                  )}

                  {task.priority && (
                    <div className={`
                      flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                      ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-100/50'}
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
                        : 'hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-700'
                      }
                    `}
                    title="Edit task"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={(e) => onDeleteTask(e, task.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-all duration-200"
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
                        : 'hover:bg-zinc-200/70 text-zinc-500 hover:text-zinc-700'
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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full shadow-lg shadow-blue-500/50" />
            )}
          </div>
        );
      })}
    </div>
  );
}
