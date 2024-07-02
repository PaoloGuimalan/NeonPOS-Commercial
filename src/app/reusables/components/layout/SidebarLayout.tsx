import React from 'react';
import { cn } from '../../../lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function SidebarLayout({ children, className }: Props) {
  return <div className={cn('w-full h-full flex flex-row bg-shade font-Inter', className)}>{children}</div>;
}

export default SidebarLayout;
