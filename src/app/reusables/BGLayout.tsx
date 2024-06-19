import React from 'react';
import NeonPOSSVG from '../../assets/NeonPOS_BG.svg';

type Props = {
  children: React.ReactNode;
  className: string;
};

function BGLayout({ children, className }: Props) {
  return (
    <div
      style={{
        backgroundImage: `url(${NeonPOSSVG})`
      }}
      className={`w-full h-full bg-cover bg-bottom bg-no-repeat bg-neonsvg ${className}`}
    >
      {children}
    </div>
  );
}

export default BGLayout;
