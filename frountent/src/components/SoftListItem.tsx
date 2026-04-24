import { useTheme } from '../context/ThemeContext';
import { Circle, CheckCircle2, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
  priority?: string;
  due_date?: string;
}

interface SoftListItemProps {
  task: Task;
  isSelected: boolean;
  isFavorite: boolean;
  isCompleted?: boolean;
  onClick: () => void;
  onToggleComplete: () => void;
  onToggleFavorite?: () => void;
}

export function SoftListItem({
  task,
  isSelected,
  isFavorite,
  isCompleted = false,
  onClick,
  onToggleComplete,
  onToggleFavorite,
}: SoftListItemProps) {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  const getStatusColor = () => {
    const status = task.status.toLowerCase();
    if (status === 'done') return colors.primary;
    if (status === 'doing') return '#f59e0b';
    return isDark ? '#71717a' : '#a1a1aa';
  };

  const statusColor = getStatusColor();

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-lg border transition-all duration-200 cursor-pointer",
        isDark 
          ? "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06]" 
          : "bg-black/[0.03] border-black/[0.08] hover:bg-black/[0.05]",
        isSelected && "ring-2 ring-offset-0",
        isCompleted && "opacity-60"
      )}
      style={{
        backdropFilter: 'blur(8px)',
        ...(isSelected && { ringColor: colors.primary + '60' }),
      }}
    >
      <div className="flex items-center gap-4 px-4 py-3.5">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isCompleted
              ? "border-transparent"
              : isDark
              ? "border-zinc-600 hover:border-zinc-500"
              : "border-zinc-400 hover:border-zinc-500"
          )}
          style={isCompleted ? {
            backgroundColor: statusColor,
            borderColor: statusColor,
          } : undefined}
          onMouseEnter={(e) => {
            if (!isCompleted) {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
              e.currentTarget.style.borderColor = colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isCompleted) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = isDark ? '#52525b' : '#a1a1aa';
            }
          }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          ) : (
            <Circle className="w-3 h-3 text-transparent" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "text-[15px] font-medium leading-snug transition-colors",
            isCompleted && "line-through",
            isDark 
              ? isCompleted ? "text-zinc-500" : "text-zinc-200"
              : isCompleted ? "text-zinc-500" : "text-zinc-800"
          )}>
            {task.title}
          </div>
          {task.description && (
            <div className={cn(
              "text-xs mt-1 line-clamp-1",
              isDark ? "text-zinc-600" : "text-zinc-500"
            )}>
              {task.description}
            </div>
          )}
        </div>

        {/* Status Badge */}
        {!isCompleted && (
          <div
            className={cn(
              "flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider",
              isDark ? "bg-white/[0.06]" : "bg-black/[0.06]"
            )}
            style={{ color: statusColor }}
          >
            {task.status}
          </div>
        )}

        {/* Favorite Star */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100",
              isDark 
                ? "hover:bg-white/[0.08]" 
                : "hover:bg-black/[0.08]",
              isFavorite && "opacity-100"
            )}
            style={isFavorite ? { color: colors.primary } : undefined}
          >
            <Star 
              className={cn("w-4 h-4", isFavorite && "fill-current")} 
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Hover Indicator */}
      <div 
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 rounded-r-full transition-all duration-200 group-hover:h-8",
          "opacity-0 group-hover:opacity-100"
        )}
        style={{ backgroundColor: colors.primary }}
      />
    </div>
  );
}
