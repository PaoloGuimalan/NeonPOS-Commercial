import { z } from 'zod';

export const LoginSchema = z.object({
  accountID: z.string().min(1),
  password: z.string().min(1)
});

export const SetupSchema = z.object({
  userID: z.string().min(1),
  deviceID: z.string().min(1),
  connectionToken: z.string().min(1),
  posType: z.string().min(1),
  setup: z.string().min(1)
});
