// app/routes/api/users.$id.ts
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "~/config/prisma.server";

// GET /api/users/:id
export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.id;

  if (!userId) {
    return json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    // Default password
    const defaultPassword = "changeme123";

    // Comparar el hash del user con la contraseña por default
    const isDefaultPassword = await bcrypt.compare(defaultPassword, user.password);

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };

    const userWithPasswordFlag = {
      ...userWithoutPassword,
      has_password: !isDefaultPassword,
    };


    return json(userWithPasswordFlag, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};

// PUT & DELETE /api/users/:id
export const action: ActionFunction = async ({ params, request }) => {
  const userId = params.id;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      // Verificar si existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
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
        },
      });

      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Transacción: eliminar relaciones y finalmente el usuario
      await prisma.$transaction(async (tx) => {
        // Borrar TeamMembers relacionados
        await tx.teamMember.deleteMany({ where: { user_id: userId } });

        // Borrar UserStats
        await tx.userStats.deleteMany({ where: { user_id: userId } });

        // Borrar WorkEntries y ScheduleEntries
        await tx.workEntry.deleteMany({ where: { user_id: userId } });
        await tx.scheduleEntry.deleteMany({ where: { user_id: userId } });

        // Setear a null account_manager_id en Clients
        await tx.client.updateMany({
          where: { account_manager_id: userId },
          data: { account_manager_id: null },
        });

        // Setear a null changedById en ClientStatusHistory
        await tx.clientStatusHistory.updateMany({
          where: { changedById: userId },
          data: { changedById: null },
        });

        // Finalmente borrar el usuario
        await tx.user.delete({ where: { id: userId } });
      });

      return new Response(JSON.stringify({ deleted: user }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const userJson = formData.get("user") as string;

      if (!userJson) {
        return new Response(JSON.stringify({ error: "No user data provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const updatedFields = JSON.parse(userJson);
      delete updatedFields.password;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: updatedFields.name,
          email: updatedFields.email,
          phone: updatedFields.phone,
          is_admin: updatedFields.is_admin,
          is_active: updatedFields.is_active,
          is_account_manager: updatedFields.is_account_manager,
          type: updatedFields.type,
          avatar: updatedFields.avatar,
          last_login: updatedFields.last_login
            ? new Date(updatedFields.last_login)
            : null,
        },
        select: {
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
        },
      });

      return new Response(JSON.stringify({ updated: updatedUser }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported method" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing user action:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};