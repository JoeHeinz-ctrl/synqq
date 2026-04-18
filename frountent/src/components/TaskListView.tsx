import { Check, Circle, Clock, User, Calendar, Trash2, Edit } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
  due_date?: string;
  assigned_user_id?: number;
  created_at?: string;
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

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('done')) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    if (normalizedStatus.includes('doing') || normalizedStatus.includes('progress')) {
      return <Clock className="w-5 h-5 text-amber-500" />;
    }
    return <Circle className="w-5 h-5 text-zinc-500" />;
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes('done')) {
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    }
    if (normalizedStatus.includes('doing') || normalizedStatus.includes('progress')) {
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
    return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Circle className="w-16 h-16 text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-400 mb-2">No tasks yet</h3>
        <p className="text-sm text-zinc-600">Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          onClick={() => onTaskClick(task.id)}
          className={`
            group relative flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all cursor-pointer
            ${selectedTaskId === task.id 
              ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/10' 
              : isDark 
                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/70 hover:shadow-lg' 
                : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md'
            }
          `}
        >
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {getStatusIcon(task.status)}
          </div>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className={`font-medium text-[15px] truncate ${
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              }`}>
                {task.title}
              </h3>
              <span className={`
                px-2.5 py-1 text-[11px] font-semibold rounded-md border uppercase tracking-wide
                ${getStatusBadge(task.status)}
              `}>
                {task.status}
              </span>
            </div>

            {/* Task Meta */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              {task.due_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(task.due_date).toLocaleDateString()}</span>
                </div>
              )}
              {task.assigned_user_id && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Assigned</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditTask(task.id);
              }}
              className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => onDeleteTask(e, task.id)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-500 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
