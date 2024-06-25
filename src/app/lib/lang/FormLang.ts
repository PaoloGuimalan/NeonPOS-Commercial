import { Password } from '../typings/Password';

export const message = {
  form: {
    error: {
      name: (isFor: string) =>
        `${isFor} should consist of at least 1 character and should not contain any special characters.`,
      username: 'Username should consist of at least 1 character',
      password: (validation: Password) => {
        const { haveDigits, haveSpecialChar, haveUppercase, eightCharLong } = validation;

        const errors: string[] = [];
        if (!haveDigits) {
          errors.push('Password must have at least one digit.');
        }
        if (!haveSpecialChar) {
          errors.push('Password must have at least one special symbol.');
        }
        if (!haveUppercase) {
          errors.push('Password must have at least one uppercase character.');
        }
        if (!eightCharLong) {
          errors.push('Password must be 8 characters long.');
        }

        return errors.join('\n');
      },
      currentPassword: 'Current password is required',
      confirmPassword: "Confirm password doesn't match to password",
      groups: 'Please select at least one group.'
    }
  }
};
