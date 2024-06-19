import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

const headerVariants = cva('font-Inter text-heading-300', {
  variants: {
    type: {
      h1: 'sm:text-3xl md:text-5xl lg:text-7xl',
      h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
      h3: 'xs:text-lg sm:text-xl md:text-2xl lg:text-3xl',
      h4: 'xs:text-md sm:text-lg md:text-2xl',
      h5: 'xs:text-sm sm:text-md md:text-lg lg:text-xl'
    }
  },
  defaultVariants: {
    type: 'h1'
  }
});

interface HeaderProps extends React.AllHTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headerVariants> {
  className?: string;
  children: React.ReactNode;
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(({ className, type, children }, ref) => {
  return React.createElement(
    type,
    {
      className: `${cn(headerVariants({ type, className }))}`,
      ref
    },
    children
  );
});
Header.displayName = 'Header';

export default Header;
