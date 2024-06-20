import * as React from 'react';

import { cn } from '../../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  searchTextOffset?: string;
  iconPosition?: string;
  inputs?: number;
  isAgent?: boolean;
  className?: string;
  type?: string;
  maxLength?: number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, searchTextOffset, iconPosition, type, maxLength, inputs, isAgent, ...props }, ref) => {
    return (
      <div className="bg-red-500/0 relative">
        <input
          type={type}
          className={cn(
            'flex h-9 w-full  rounded-md border duration-300 transition border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm  file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
            className,
            icon && searchTextOffset,
            isAgent && 'pr-11'
          )}
          ref={ref}
          maxLength={maxLength}
          {...props}
        />
        {icon && <div className={cn('absolute left-2 top-1/2 -translate-y-1/2', iconPosition)}>{icon}</div>}
        {isAgent && (
          <div className="absolute bottom-1 right-2 text-xs font-medium text-[#cbcaca]">
            {inputs}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;
