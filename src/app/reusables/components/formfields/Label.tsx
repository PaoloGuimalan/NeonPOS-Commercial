import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-heading-300',
  {
    variants: {
      variant: {
        lg: 'xs:text-xs sm:text-sm md:text-md lg:text-lg',
        md: 'text-sm lg:text-md',
        sm: 'text-sm',
        xs: 'text-xs'
      }
    },
    defaultVariants: {
      variant: 'lg'
    }
  }
);

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {
  className?: string;
  variant?: 'lg' | 'md' | 'sm' | 'xs';
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, variant, ...props }, ref) => (
  <label ref={ref} className={cn(labelVariants({ variant, className }))} {...props} />
));
Label.displayName = 'Label';

export { Label };
