// * Function for validating password
export const validatePassword = (password: string) => {
  const regs = /^(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/;

  const validate = {
    haveDigits: password?.search(/[0-9]/) >= 0,
    haveSpecialChar: regs.test(password),
    eightCharLong: password?.length >= 8,
    haveUppercase: /[A-Z]/.test(password)
  };

  return validate;
};
