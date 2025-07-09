// app/utils/schemas/userSchema.ts
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  is_admin: z.coerce.boolean().optional(),
  is_active: z.coerce.boolean().optional(),
  is_account_manager: z.coerce.boolean().optional(),
  rate_type: z.coerce.number().optional(),
  avatar: z.string().url("Invalid avatar URL").nullable().optional(),
  last_login: z.string().datetime("Invalid datetime format").nullable().optional(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});