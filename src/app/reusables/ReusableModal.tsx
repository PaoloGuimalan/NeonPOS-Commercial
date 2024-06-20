import React from 'react';

type Props = {
  shaded: boolean;
  padded: boolean;
  children: React.ReactNode;
};

function ReusableModal({ shaded, padded, children }: Props) {
  return (
    <div
      className={`z-[2] fixed top-0 ${padded ? 'left-[80px]' : 'left-0'} ${shaded ? 'bg-modal' : 'bg-transparent'} ${
        padded ? 'w-[calc(100%-80px)]' : 'w-full'
      } h-full flex items-center justify-center`}
    >
      {children}
    </div>
  );
}

export default ReusableModal;
