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

  // 2️⃣ Determinar el mes actual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  // 3️⃣ Query para traer todos los work entries del mes de este usuario
  const workEntries = await prisma.workEntry.findMany({
    where: {
      user_id: userId,
      created_at: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
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

  return new Response(JSON.stringify({ workEntries }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};