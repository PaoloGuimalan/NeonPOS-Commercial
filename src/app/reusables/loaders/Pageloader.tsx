import React from 'react';
import Buttonloader from './Buttonloader';
import { cn } from '../../lib/utils';

type Props = {
  className?: string;
};

function Pageloader({ className }: Props) {
  return (
    <div className={cn('w-full flex items-center justify-center', className)}>
      <Buttonloader size="25px" />
    </div>
  );
}

export default Pageloader;
