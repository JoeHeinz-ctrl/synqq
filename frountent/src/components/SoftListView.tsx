import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { SoftListItem } from './SoftListItem';

interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  due_date?: string;
  assigned_tosss?: number;
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
    <div className="w-full h-full px-12 py-2 overflow-y-auto">
      {/* Active Tasks Section */}
      {activeTasks.length > 0 && (
        <div className="mb-6">
          <div 
            className="text-sm font-semibold mb-3"
            style={{ color: isDark ? '#888' : '#666' }}
          >
            Tasks · {activeTasks.length}
          </div>
          <div className="space-y-4">
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

      {/* Empty State */}
      {activeTasks.length === 0 && completedTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <div style={{ fontSize: '48px', opacity: 0.3, marginBottom: '16px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '500', color: isDark ? '#888' : '#666', marginBottom: '8px' }}>
            No tasks yet
          </div>
          <div style={{ fontSize: '14px', color: isDark ? '#666' : '#999' }}>
            Create a task to get started
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setCompletedExpanded(!completedExpanded)}
            className="flex items-center gap-2 text-sm font-semibold mb-3 hover:opacity-80 transition-opacity"
            style={{ color: isDark ? '#888' : '#666' }}
          >
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              style={{ 
                transform: completedExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M7 10l5 5 5-5z"></path>
            </svg>
            Completed · {completedTasks.length}
          </button>

          {completedExpanded && (
            <div className="space-y-4">
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
