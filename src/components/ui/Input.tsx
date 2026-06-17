import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', icon, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-medium text-on-surface-variant ml-0.5 block">
            {label}
          </label>
        )}
        <div className="relative group flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-outline-variant group-focus-within:text-primary transition-colors pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex w-full rounded-xl bg-surface-container-lowest border py-3 px-4 text-sm transition-all outline-none',
              'placeholder:text-on-surface-variant/40',
              error
                ? 'border-error focus:ring-2 focus:ring-error/20 focus:border-error'
                : 'border-outline-variant focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-11',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-error ml-0.5 flex items-center gap-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
