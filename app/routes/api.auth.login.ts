// app/routes/api/auth/login.ts
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import bcrypt from "bcryptjs";
import { LoginSchema } from "~/utils/schemas/loginSchema";
import { getSession, commitSession } from "~/config/session.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let company_id: string | undefined = undefined;

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

  let role: "ADMIN" | "USER" | "CLIENT" = "USER";
  let sessionUser: { id: string; email: string; name: string; is_admin: boolean };

  // Buscar primero en users
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const passwordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;
 
    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    role = user.is_admin ? "ADMIN" : "USER";
    sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      is_admin: user.is_admin,
    };
  } else {
    // Buscar en contacts si no se encuentra en users
    const contact = await prisma.contact.findUnique({ where: { email } });
    if (!contact) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }else{ 
      company_id = contact?.client_id || undefined
    }

    const passwordValid = contact.password
      ? await bcrypt.compare(password, contact.password)
      : false;

    if (!passwordValid) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    role = "CLIENT";
    sessionUser = {
      id: contact.id,
      email: contact.email,
      name: contact.name,
      is_admin: false,
    };
  }

  // Crear sesión
  const session = await getSession(request);
  session.set("id", sessionUser.id);
  session.set("email", sessionUser.email);
  session.set("name", sessionUser.name);
  session.set("role", role);

  if (role === "CLIENT" && company_id) {
    session.set("company_id", company_id);
  }

  return new Response(
    JSON.stringify({ success: true, message: "Login successfully" }),
    {
      status: 200,
      headers: {
        "Set-Cookie": await commitSession(session),
        "Content-Type": "application/json",
      },
    }
  );
};