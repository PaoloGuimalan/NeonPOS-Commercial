import { useFormOptions } from '../../../hooks/useFormOptions';
import Input from './Input';
import { Label } from './Label';
import { Paragraph } from '..';
import ShowHidePasswordButton from './ShowHidePasswordButton';
import { cn } from '../../../lib/utils';
import React from 'react';

interface Props {
  className?: string;
  placeholder: string;
  label?: string;
  inputProps?: React.ComponentPropsWithoutRef<'input'>;
}

const Password = ({ className, label, inputProps, ...props }: Props) => {
  const { hideHandler, hidePassword } = useFormOptions();
  const { type, hide } = hidePassword;
  return (
    <div className={cn(`w-full`, className)}>
      <Label>
        {label && (
          <Paragraph fontSize="sm" className="mb-1 font-semibold">
            {label}
          </Paragraph>
        )}
        <div className="w-full h-full relative">
          <Input maxLength={150} {...props} {...inputProps} type={type} className="pr-9" />
          <ShowHidePasswordButton
            onClick={hideHandler}
            hide={hide}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>
      </Label>
    </div>
  );
};

export default Password;
