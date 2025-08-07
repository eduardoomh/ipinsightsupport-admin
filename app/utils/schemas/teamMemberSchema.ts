import { z } from "zod";

export const TeamMemberSchema = z.object({
  client_id: z.string().min(1, { message: "Se requiere el ID del cliente" }),
  user_id: z.string().min(1, { message: "Se requiere el ID del usuario" }),
  role: z.enum(["on_team", "technical_lead"], {
    required_error: "El rol es obligatorio",
  }),
  rate_type: z.enum(["engineering", "architecture", "senior_architecture"], {
    required_error: "El tipo de tarifa es obligatorio",
  }),
});