// app/routes/api/auth/login.ts
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import bcrypt from "bcryptjs";
import { LoginSchema } from "~/utils/schemas/loginSchema";
import { getSession, commitSession } from "~/config/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  // Validación Zod
  const parsed = LoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ errors: parsed.error.flatten().fieldErrors }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(
      JSON.stringify({ error: "Credenciales inválidas" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Crear sesión
  const session = await getSession(request);
  session.set("userId", user.id);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Set-Cookie": await commitSession(session),
      "Content-Type": "application/json",
    },
  });
};