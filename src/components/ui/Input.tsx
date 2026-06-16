import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="font-label-md text-on-surface-variant ml-1 block">{label}</label>}
        <div className="relative group flex items-center">
          {icon && (
            <div className="absolute left-4 text-outline-variant group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full rounded-lg bg-surface-container-lowest border border-outline-variant py-2.5 px-4 font-body-md transition-all outline-none",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50",
              icon && "pl-11",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <span className="font-label-sm text-error ml-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
