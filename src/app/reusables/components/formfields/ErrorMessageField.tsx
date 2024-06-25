import React from 'react';
import Paragraph from '../typography/Paragraph';

interface Props {
  errorText?: string;
}

const ErrorMessageField = ({ errorText }: Props) => {
  if (!errorText) return <></>;

  return (
    <Paragraph
      fontSize="md"
      className="!mb-0 whitespace-pre-line p-1 text-xs font-semibold leading-normal text-red-500"
    >
      {errorText}
    </Paragraph>
  );
};

export default ErrorMessageField;
