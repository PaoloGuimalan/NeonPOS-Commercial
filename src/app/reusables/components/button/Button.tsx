/* eslint-disable react/button-has-type */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';
import AnimatedLoader from '../../AnimatedLoader';
// import { AnimatedLoader } from '../customs/AnimatedLoader/AnimatedLoader';
// import { Flex } from '../customs/Wrappers';

export const buttonVariants = cva(
  ' whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-primary-500 text-slate-50 shadow hover:bg-primary-500/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90',
        destructive:
          'bg-red-500 text-slate-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90',
        outline:
          'border border-slate-200 bg-transparent shadow-sm hover:bg-gray-200 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        secondary:
          'bg-[#01010B] text-white shadow-sm hover:bg-[#01010B]/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80 disabled:bg-[#EBEAE9] disabled:text-[#717171]/60',
        ghost: 'hover:bg-gray-200 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50',
        link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50'
      },
      size: {
        default: 'h-9 px-4 py-0',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
        base: 'text-[14px] h-9 px-4 py-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'base';
  loading?: boolean;
  icon?: React.ReactNode;
  childClass?: string;
  innerChildClass?: string;
  className?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, loading, icon, childClass, innerChildClass, ...props }, ref) => {
    return (
      <button
        children={
          loading || icon ? (
            // <Flex variant="centered" className={cn('flex gap-2', childClass)}>
            //   {loading && <AnimatedLoader className="!me-0" color={loaderColor} />}
            //   {icon}
            //   {children && <span className={innerChildClass}>{children}</span>}
            // </Flex>
            <div className={cn('flex items-center gap-2 justify-center', childClass)}>
              {loading && <AnimatedLoader />}
              {icon}
              {children && <span className={innerChildClass}>{children}</span>}
            </div>
          ) : (
            <span className={innerChildClass}>{children}</span>
          )
        }
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
