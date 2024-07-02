import React from 'react';

interface Prop {
  header: string;
  message: string;
}

function Underdevelopment({ header, message }: Prop) {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center">
      <span className="text-[20px] font-semibold font-Inter">{header}</span>
      <span className="text-[14px] font-Inter">{message}</span>
    </div>
  );
}

export default Underdevelopment;
