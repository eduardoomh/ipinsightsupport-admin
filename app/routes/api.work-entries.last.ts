import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // 1️⃣ Obtener el userId de la sesión
  const userId = await getUserId(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2️⃣ Obtener query params opcionales
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id"); // opcional para filtrar por cliente

  // 3️⃣ Query para traer el work entry más reciente de este usuario
  const workEntry = await prisma.workEntry.findFirst({
    where: {
      user_id: userId,
      ...(clientId ? { client_id: clientId } : {}),
    },
    include: {
      client: {
        select: {
          id: true,
          company: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return new Response(JSON.stringify({ workEntry }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};