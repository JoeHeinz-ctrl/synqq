import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white',
    icon: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white p-2',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        variant !== 'icon' && sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

// Export buttonVariants for compatibility with existing code
export const buttonVariants = (props?: { variant?: 'primary' | 'ghost' | 'icon' | 'outline' }) => {
  const variant = props?.variant || 'primary';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white',
    icon: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white p-2',
    outline: 'border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white',
  };
  return variants[variant];
};
