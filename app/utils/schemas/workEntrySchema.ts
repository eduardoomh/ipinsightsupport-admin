// ~/utils/schemas/workEntrySchema.ts
import { z } from "zod";

export const WorkEntrySchema = z.object({
  billed_on: z.string().datetime(),
  hours_billed: z.number().nonnegative(),
  hours_spent: z.number().nonnegative(),
  hourly_rate: z.number().nonnegative(),
  summary: z.string().min(1),
  rate_type: z.enum(["engineering", "architecture", "senior_architecture"]),
  client_id: z.string().min(1),
  user_id: z.string().min(1),
});