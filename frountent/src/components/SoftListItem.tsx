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

  const getStatusColor = () => {
    const status = task.status.toLowerCase();
    if (status === 'done') return colors.primary;
    if (status === 'doing') return '#f59e0b';
    return isDark ? '#71717a' : '#a1a1aa';
  };

  const statusColor = getStatusColor();

  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '8px',
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        opacity: isCompleted ? 0.6 : 1,
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        if (!isSelected) {
          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
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
        {isCompleted && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
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
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
