import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('max-w-[1200px] mx-auto px-8 py-8 w-full', className)}>
      {children}
    </div>
  );
}
