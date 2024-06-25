import React from 'react';
import Eye from '../../../../assets/icons/Eye';
import EyeOff from '../../../../assets/icons/EyeOff';

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  hide: boolean;
}

export default function ShowHidePasswordButton({ hide, ...otherProps }: Props) {
  return (
    <div {...otherProps}>
      {!hide ? <Eye className="w-5 cursor-pointer" /> : <EyeOff className="w-5 cursor-pointer" />}
    </div>
  );
}
