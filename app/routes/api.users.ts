// app/routes/api/users.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { UserSchema } from "~/utils/schemas/userSchema";
import { prisma } from "~/config/prisma.server";
import { Resend } from "resend";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";
import { renderSetPasswordEmailHTML } from "~/utils/emails/set-password";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { getUserId } from "~/config/session.server";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");

// GET /api/users → obtener todos los usuarios

export const loader: LoaderFunction = async ({ request }) => {

  const userId = await getUserId(request);
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";
  const fieldsParam = url.searchParams.get("fields");
  const filter = url.searchParams.get("filter"); // Nuevo parámetro

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const defaultSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    is_admin: true,
    is_active: true,
    is_account_manager: true,
    type: true,
    avatar: true,
    last_login: true,
    createdAt: true,
    updatedAt: true,
  };

  const dynamicSelect = buildDynamicSelect(fieldsParam, defaultSelect);

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: dynamicSelect,
  });

  // Filtro por account_manager
  if (filter === "is_account_manager") {
    queryOptions.where = {
      ...(queryOptions.where || {}),
      is_account_manager: true,
    };
  }

  const users = await prisma.user.findMany(queryOptions);

  const { items, pageInfo } = buildPageInfo(users, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ users: items, pageInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
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

    // ✅ Validar con Zod
    const user = UserSchema.parse(userParsed);

    const defaultPassword = "changeme123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 1️⃣ Crear usuario sin contraseña todavía
    const savedUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        is_admin: user.is_admin ?? false,
        is_active: user.is_active ?? true,
        is_account_manager: user.is_account_manager ?? false,
        type: user.type ?? "engineering",
        avatar: user.avatar ?? null,
        last_login: user.last_login ? new Date(user.last_login) : null,
        password: hashedPassword
      },
    });

    // 2️⃣ Crear token JWT para que el usuario pueda establecer su contraseña
    const tokenPayload = { id: savedUser.id, email: savedUser.email, type: 'USER' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "changeme", {
      expiresIn: "1d",
    });

    // 3️⃣ Construir URL de set password
    const setPasswordUrl = `${process.env.APP_URL}/create-password?token=${token}`;

    // 4️⃣ Renderizar HTML del email
    const html = renderSetPasswordEmailHTML({
      name: savedUser.name,
      setPasswordUrl,
    });

    // 5️⃣ Enviar correo con Resend
    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: savedUser.email,
      subject: "Welcome! Set your password",
      html,
    });

    // 6️⃣ Retornar usuario sin contraseña
    const { password, ...userWithoutPassword } = savedUser;

    return new Response(JSON.stringify({
      message: "User created and invitation email sent",
      user: userWithoutPassword,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.log(error)
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