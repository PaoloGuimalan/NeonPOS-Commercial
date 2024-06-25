import React from 'react';
import Database from '../../../../assets/icons/Database';
import Paragraph from '../typography/Paragraph';

type Props = {
  className?: string;
  size: string;
  title: string;
};

const Empty = ({ className, title, size }: Props) => {
  return (
    <div className={`${className} w-full flex items-center justify-center`}>
      <div>
        <Database className={`${size} mb-2 fill-gray-900`} />
        <Paragraph fontSize="md" className="text-center">
          {title}
        </Paragraph>
      </div>
    </div>
  );
};

export default Empty;
