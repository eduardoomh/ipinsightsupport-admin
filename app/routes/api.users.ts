// app/routes/api/users.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { UserSchema } from "~/utils/schemas/userSchema";
import { prisma } from "~/config/prisma.server";
import bcrypt from "bcryptjs"; // ✅ Importa bcryptjs

// GET /api/users → obtener todos los usuarios
export const loader: LoaderFunction = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      is_admin: true,
      is_active: true,
      is_account_manager: true,
      rate_type: true,
      avatar: true,
      last_login: true,
      createdAt: true,
      updatedAt: true,
      // 🚫 No incluimos password
    },
  });

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/users → crear nuevo usuario con validación Zod y contraseña hasheada
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const userJson = formData.get("user") as string;

  if (!userJson) {
    return new Response(JSON.stringify({ error: "No user data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const userParsed = JSON.parse(userJson);

    // Validar con el esquema importado
    const user = UserSchema.parse(userParsed);

    // ✅ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const savedUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_admin: user.is_admin ?? false,
        is_active: user.is_active ?? true,
        is_account_manager: user.is_account_manager ?? false,
        rate_type: user.rate_type ?? 0,
        avatar: user.avatar ?? null,
        last_login: user.last_login ? new Date(user.last_login) : null,
        password: hashedPassword, // ✅ Guardar contraseña hasheada
      },
    });

    const { password, ...userWithoutPassword } = savedUser;

    return new Response(JSON.stringify(userWithoutPassword), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};