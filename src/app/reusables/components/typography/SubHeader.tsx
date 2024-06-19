import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

const subHeaderVariants = cva('font-Inter text-heading-300', {
  variants: {
    fontSize: {
      lg: 'text-lg lg:text-xl',
      md: 'text-md lg:text-lg',
      sm: 'text-sm lg:text-md'
    }
  },
  defaultVariants: {
    fontSize: 'lg'
  }
});

interface SubHeaderProps extends React.AllHTMLAttributes<HTMLParagraphElement>, VariantProps<typeof subHeaderVariants> {
  className?: string;
  fontSize: 'lg' | 'md' | 'sm';
}

const SubHeader = React.forwardRef<HTMLParagraphElement, SubHeaderProps>(({ className, fontSize, ...props }, ref) => {
  return <p className={cn(subHeaderVariants({ fontSize, className }))} ref={ref} {...props} />;
});
SubHeader.displayName = 'SubHeader';

export default SubHeader;
