import { z } from 'zod';

export const PermissionSchema = z.object({
  permissionType: z.string().min(1),
  allowedUsers: z.array(z.string().min(1)).min(1)
});
