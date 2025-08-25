// app/routes/api/client-status-history.$id.ts
import type { ActionFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

// DELETE /api/client-status-history/:id
export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;

  if (request.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing history ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verificamos si existe el registro
    const existing = await prisma.clientStatusHistory.findUnique({
      where: { id },
    });

    if (!existing) {
      return new Response(JSON.stringify({ error: "History not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Lo eliminamos
    await prisma.clientStatusHistory.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ deleted: true, id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting client status history:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};