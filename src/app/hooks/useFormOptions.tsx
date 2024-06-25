import { useState } from 'react';

interface PasswordOption {
  hide: boolean;
  type: string;
}

export const useFormOptions = () => {
  const [hidePassword, setHidePassword] = useState<PasswordOption>({
    hide: true,
    type: 'password'
  });

  // * Funtion for show & hide of password in form
  const hideHandler = () =>
    setHidePassword((prev) => ({
      hide: !prev.hide,
      type: !prev.hide ? 'password' : 'text'
    }));

  return {
    hidePassword,
    hideHandler
  };
};
