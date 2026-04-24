import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

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
  
  // Double-tap/double-click detection
  const lastTapRef = useRef<number>(0);

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'svg' || target.closest('svg')) {
      return;
    }

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 400 && timeSinceLastTap > 0) {
      // Double click detected - open editor
      e.preventDefault();
      e.stopPropagation();
      onClick();
      lastTapRef.current = 0; // Reset
    } else {
      lastTapRef.current = now;
    }
  };

  const handleTouch = (e: React.TouchEvent) => {
    // Don't trigger if touching buttons
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.tagName === 'svg' || target.closest('svg')) {
      return;
    }

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < 400 && timeSinceLastTap > 0) {
      // Double tap detected - open editor
      e.preventDefault();
      e.stopPropagation();
      onClick();
      lastTapRef.current = 0; // Reset
    } else {
      lastTapRef.current = now;
    }
  };

  const getStatusColor = () => {
    const status = task.status.toLowerCase();
    if (status === 'done') return colors.primary;
    if (status === 'doing') return '#f59e0b';
    return isDark ? '#71717a' : '#a1a1aa';
  };

  const statusColor = getStatusColor();

  return (
    <div
      onClick={handleClick}
      onTouchEnd={handleTouch}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '8px',
        background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
        border: isSelected 
          ? `2px solid ${colors.primary}` 
          : `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e5e5e5'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        opacity: isCompleted ? 0.6 : 1,
        position: 'relative',
        boxShadow: isDark 
          ? '0 1px 3px rgba(0,0,0,0.3)' 
          : '0 1px 2px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : '#fafafa';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.18)' : '#d4d4d4';
        e.currentTarget.style.boxShadow = isDark 
          ? '0 4px 12px rgba(0,0,0,0.4)' 
          : '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : '#ffffff';
        e.currentTarget.style.boxShadow = isDark 
          ? '0 1px 3px rgba(0,0,0,0.3)' 
          : '0 1px 2px rgba(0,0,0,0.05)';
        if (!isSelected) {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : '#e5e5e5';
        }
      }}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleComplete();
        }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: isCompleted ? 'none' : `2px solid ${isDark ? '#666' : '#999'}`,
          background: isCompleted ? statusColor : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isCompleted) {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.background = colors.primaryLight;
          }
        }}
        onMouseLeave={(e) => {
          if (!isCompleted) {
            e.currentTarget.style.borderColor = isDark ? '#666' : '#999';
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {isCompleted && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </button>

      {/* Task Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: isDark ? (isCompleted ? '#666' : '#fff') : (isCompleted ? '#999' : '#000'),
            textDecoration: isCompleted ? 'line-through' : 'none',
            marginBottom: task.description ? '4px' : 0,
          }}
        >
          {task.title}
        </div>
        {task.description && (
          <div
            style={{
              fontSize: '13px',
              color: isDark ? '#666' : '#999',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {task.description}
          </div>
        )}
      </div>

      {/* Status Badge */}
      {!isCompleted && (
        <div
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            textTransform: 'uppercase',
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            color: statusColor,
            flexShrink: 0,
          }}
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
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: isFavorite ? colors.primary : isDark ? '#666' : '#999',
            fontSize: '16px',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </button>
      )}
    </div>
  );
}
