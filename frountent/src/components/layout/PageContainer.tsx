import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8',
        className
      )}
    >
      {children}
    </div>
  );
}
