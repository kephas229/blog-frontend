import React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("bg-surface-container-lowest rounded-xl border border-outline-variant shadow-soft overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 border-b border-outline-variant", className)} {...props}>
    {children}
  </div>
);

export const CardContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("font-headline-sm text-on-surface font-semibold", className)} {...props}>
    {children}
  </h3>
);
