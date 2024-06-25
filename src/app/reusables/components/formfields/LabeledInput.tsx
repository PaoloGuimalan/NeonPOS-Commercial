import React from 'react';
import { Input, Paragraph } from '..';
import { Label } from './Label';

interface Props extends React.ComponentPropsWithRef<'input'> {
  label: string;
  className?: string;
}

const LabeledInput = React.forwardRef<HTMLInputElement, Props>(({ className, label, ...props }, ref) => {
  return (
    <div className={`w-full ${className}`}>
      <Label>
        <Paragraph fontSize="sm" className="mb-1">
          {label}
        </Paragraph>
        <Input {...props} ref={ref} />
      </Label>
    </div>
  );
});

export default LabeledInput;
