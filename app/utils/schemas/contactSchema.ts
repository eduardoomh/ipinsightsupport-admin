import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  client_id: z.string().nullable().optional(),
});