import { z } from "zod";

export const ClientRatesSchema = z.object({
  clientId: z.string().min(1, { message: "Se requiere el ID del cliente" }),
  engineeringRate: z.number().nonnegative({ message: "Debe ser un número ≥ 0" }),
  architectureRate: z.number().nonnegative({ message: "Debe ser un número ≥ 0" }),
  seniorArchitectureRate: z.number().nonnegative({ message: "Debe ser un número ≥ 0" }),
});