import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
    
    const variants = {
      primary: "bg-primary text-on-primary hover:opacity-90 shadow-sm",
      secondary: "bg-secondary text-on-secondary hover:opacity-90 shadow-sm",
      outline: "border border-outline-variant text-on-surface hover:bg-surface-container-high",
      ghost: "text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20",
      danger: "bg-error text-on-error hover:opacity-90 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8 text-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
