import { z } from "zod";
const nonNegativeString = z
  .string()
  .min(1, { message: "Debe ser un número ≥ 0" })
  .refine((val) => /^\d+(\.\d+)?$/.test(val), {
    message: "Debe ser un número ≥ 0",
  });

export const ClientRatesSchema = z.object({
  clientId: z.string().min(1, { message: "Se requiere el ID del cliente" }),
  engineeringRate: nonNegativeString,
  architectureRate: nonNegativeString,
  seniorArchitectureRate: nonNegativeString,
});