import { z } from "zod";

export const ScheduleEntrySchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  status: z.enum(["available", "partial", "unavailable", "meeting"]),
  note: z.string().optional(),
  user_id: z.string().min(1, "User ID is required"),
  client_id: z.string().optional(),
});
