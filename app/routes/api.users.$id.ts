import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

// DELETE y PUT /api/users/:id
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
      // Obtener el usuario antes de eliminarlo
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
          rate_type: true,
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

      await prisma.user.delete({
        where: { id: userId },
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

      // ⚠️ Remover password si por alguna razón viene en el payload
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
          rate_type: updatedFields.rate_type,
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
          rate_type: true,
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