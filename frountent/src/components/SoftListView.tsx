import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SoftListItem } from './SoftListItem';
import { cn } from '../lib/utils';

interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  due_date?: string;
  assigned_to?: number;
}

interface SoftListViewProps {
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
  onToggleFavorite?: (taskId: number) => void;
  selectedTaskId: number | null;
  favoriteTaskIds?: Set<number>;
}

export function SoftListView({
  tasks,
  onTaskClick,
  onToggleComplete,
  onToggleFavorite,
  selectedTaskId,
  favoriteTaskIds = new Set(),
}: SoftListViewProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [completedExpanded, setCompletedExpanded] = useState(true);

  // Separate active and completed tasks
  const activeTasks = tasks.filter((t) => {
    const status = t.status.toLowerCase();
    return status === 'todo' || status === 'doing';
  });

  const completedTasks = tasks.filter((t) => {
    const status = t.status.toLowerCase();
    return status === 'done';
  });

  return (
    <div className="w-full max-w-[900px] mx-auto px-6 py-6 space-y-6">
      {/* Active Tasks Section */}
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <div className={cn(
            "text-xs font-semibold uppercase tracking-wider px-2",
            isDark ? "text-zinc-500" : "text-zinc-600"
          )}>
            Tasks · {activeTasks.length}
          </div>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <SoftListItem
                key={task.id}
                task={task}
                isSelected={selectedTaskId === task.id}
                isFavorite={favoriteTaskIds.has(task.id)}
                onClick={() => onTaskClick(task.id)}
                onToggleComplete={() => onToggleComplete(task.id)}
                onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(task.id) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Active Tasks */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div 
          className={cn(
            "flex flex-col items-center justify-center py-20 rounded-xl border",
            isDark 
              ? "bg-white/[0.02] border-white/[0.08]" 
              : "bg-black/[0.02] border-black/[0.08]"
          )}
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <div className={cn(
            "text-4xl mb-4",
            isDark ? "opacity-20" : "opacity-30"
          )}>
            ✨
          </div>
          <div className={cn(
            "text-base font-medium mb-2",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}>
            No tasks yet
          </div>
          <div className={cn(
            "text-sm",
            isDark ? "text-zinc-600" : "text-zinc-500"
          )}>
            Create a task to get started
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => setCompletedExpanded(!completedExpanded)}
            className={cn(
              "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-2 transition-colors",
              isDark 
                ? "text-zinc-500 hover:text-zinc-400" 
                : "text-zinc-600 hover:text-zinc-700"
            )}
          >
            {completedExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            Completed · {completedTasks.length}
          </button>

          {completedExpanded && (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <SoftListItem
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  isFavorite={favoriteTaskIds.has(task.id)}
                  isCompleted
                  onClick={() => onTaskClick(task.id)}
                  onToggleComplete={() => onToggleComplete(task.id)}
                  onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(task.id) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
