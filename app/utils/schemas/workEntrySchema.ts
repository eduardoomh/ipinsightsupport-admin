// ~/utils/schemas/workEntrySchema.ts
import { z } from "zod";

export const WorkEntrySchema = z.object({
  billed_on: z.string().datetime(),
  hours_billed: z.number().nonnegative(),
  hours_spent: z.number().nonnegative(),
  summary: z.string().min(1),
  client_id: z.string().min(1),
  user_id: z.string().min(1),
});