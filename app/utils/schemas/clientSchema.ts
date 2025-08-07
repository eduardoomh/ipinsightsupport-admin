import { z } from "zod";

export const ClientSchema = z.object({
  company: z.string().min(1),
  currentStatus: z.enum(["ADHOC", "IN_PROGRESS", "ARCHIVE", "WAITING_ON_AM", "WAITING_ON_CLIENT", "TRANSFER"]).optional(),
  timezone: z.enum(["EASTERN", "CENTRAL", "PACIFIC", "MOUNTAIN", "EUROPE", "ASIA", "AFRICA", "LATAM", "AUSTRALIA_NZ"]).optional(),
  remainingFunds: z.number().optional(),
  most_recent_work_entry: z.string().datetime().optional(),
  most_recent_retainer_activated: z.string().datetime().optional(),
});