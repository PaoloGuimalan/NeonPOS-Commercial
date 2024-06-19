import { z } from 'zod';

export const LoginSchema = z.object({
  accountID: z.string().min(1),
  password: z.string().min(1)
});
