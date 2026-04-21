import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[1001] p-4">
        <div
          className={cn(
            'w-full rounded-2xl shadow-2xl animate-scaleIn',
            sizeClasses[size],
            isDark 
              ? 'bg-zinc-900 border border-zinc-800' 
              : 'bg-white border border-zinc-200'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between px-6 py-5 border-b",
            isDark ? "border-zinc-800" : "border-zinc-200"
          )}>
            <h2 className={cn(
              "text-xl font-semibold",
              isDark ? "text-zinc-100" : "text-zinc-900"
            )}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDark 
                  ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" 
                  : "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn(
              "px-6 py-4 border-t flex items-center justify-end gap-3",
              isDark ? "border-zinc-800" : "border-zinc-200"
            )}>
              {footer}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 150ms ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 200ms ease-out;
        }
      `}</style>
    </>
  );
}

// Button variants for modal actions
interface ModalButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function ModalButton({ onClick, children, variant = 'secondary', disabled, type = 'button' }: ModalButtonProps) {
  const { mode, getThemeColors } = useTheme();
  const isDark = mode === 'dark';
  const colors = getThemeColors();

  const baseClasses = "px-4 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  if (variant === 'primary') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(baseClasses, "text-white")}
        style={{ backgroundColor: colors.primary }}
        onMouseEnter={(e) => !disabled && (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      >
        {children}
      </button>
    );
  }

  if (variant === 'danger') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          baseClasses,
          isDark 
            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20" 
            : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        isDark 
          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-zinc-100" 
          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900"
      )}
    >
      {children}
    </button>
  );
}
