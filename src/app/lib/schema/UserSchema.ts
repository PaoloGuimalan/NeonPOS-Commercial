import { z } from 'zod';

export const UserSchema = z.object({
  firstname: z.string().min(1),
  middlename: z.string().min(1),
  lastname: z.string().min(1),
  accountType: z.string().min(1),
  password: z.string().min(1),
  confirmPassword: z.string().min(1)
});
