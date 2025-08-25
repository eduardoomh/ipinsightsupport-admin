import { z } from "zod";

export const ClientStatusHistorySchema = z.object({
  clientId: z.string().min(1, { message: "Se requiere el ID del cliente" }),
  status: z.enum([
    "ADHOC",
    "IN_PROGRESS",
    "ARCHIVE",
    "WAITING_ON_AM",
    "WAITING_ON_CLIENT",
    "TRANSFER",
  ]).optional(),
  title: z.string().optional(),
  changedById: z.string().optional(), // puede ser nulo si es automático
  note: z.string().min(1, { message: "Debe incluir una nota de cambio" }),
});