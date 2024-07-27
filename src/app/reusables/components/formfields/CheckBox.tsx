import React from 'react';
import { Label } from './Label';
import { cn } from '../../../lib/utils';

interface Props extends React.ComponentPropsWithRef<'input'> {
  label: string;
}

const CheckBox = React.forwardRef<HTMLInputElement, Props>(({ className, value, label, ...props }: Props) => {
  return (
    <div className={cn(className, 'w-full')}>
      <Label variant="md" className="flex items-center gap-2">
        <input type="checkbox" value={value} {...props} />
        {label}
      </Label>
    </div>
  );
});

export default CheckBox;
