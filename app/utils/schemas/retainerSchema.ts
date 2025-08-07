import { z } from "zod";

export const RetainerSchema = z.object({
  amount: z.number().positive({
    message: "El monto debe ser un número positivo",
  }),
  date_activated: z.string().datetime({
    message: "La fecha debe estar en formato ISO válido (ej. 2025-08-01T00:00:00Z)",
  }),
  note: z.string().optional(),
  is_credit: z.boolean().optional().default(false),
  client_id: z.string().min(1, {
    message: "Debe proporcionar un ID de cliente válido",
  }),
  created_by_id: z.string().min(1, {
    message: "Debe proporcionar un ID de usuario válido",
  }),
});
