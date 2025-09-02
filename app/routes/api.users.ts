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
import dayjs from "dayjs";

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
    const user = UserSchema.parse(userParsed);

    const defaultPassword = "changeme123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const month = dayjs().month() + 1;
    const year = dayjs().year();

    // 1️⃣ Crear usuario primero
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
        password: hashedPassword,
      },
    });

    // 2️⃣ Crear UserStats con el user_id recién generado
    const savedStats = await prisma.userStats.create({
      data: {
        user_id: savedUser.id,
        month,
        year,
        total_work_entries: 0,
        companies_as_account_manager: 0,
        companies_as_team_member: 0,
        hours_engineering: 0,
        hours_architecture: 0,
        hours_senior_architecture: 0,
      },
    });

    // 3️⃣ Crear token JWT
    const tokenPayload = { id: savedUser.id, email: savedUser.email, type: 'USER' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || "changeme", { expiresIn: "1d" });

    const setPasswordUrl = `${process.env.APP_URL}/create-password?token=${token}`;
    const html = renderSetPasswordEmailHTML({ name: savedUser.name, setPasswordUrl });

    await resend.emails.send({
      from: "no-reply@ipinsightsupport.com",
      to: savedUser.email,
      subject: "Welcome! Set your password",
      html,
    });

    const { password, ...userWithoutPassword } = savedUser;

    return new Response(JSON.stringify({
      message: "User created and invitation email sent",
      user: userWithoutPassword,
      stats: savedStats,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Error creating user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};