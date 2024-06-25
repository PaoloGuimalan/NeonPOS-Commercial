import { z } from 'zod';
import { validatePassword } from '../../helpers/passValidator';
import { message } from '../lang/FormLang';

export const UserSchema = z
  .object({
    firstname: z.string().min(1),
    middlename: z.string().min(1),
    lastname: z.string().min(1),
    accountType: z.string().min(1),
    password: z.string().superRefine((password, ctx) => {
      const errors = validatePassword(password);
      const hasError = Object.values(errors).includes(false);

      if (!hasError) return { success: true };

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: message.form.error.password(errors)
      });
    }),
    confirmPassword: z.string().min(1)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: message.form.error.confirmPassword,
    path: ['confirmPassword']
  });
