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

  // 2️⃣ Revisar query params
  const url = new URL(request.url);
  const isAdmin = url.searchParams.get("admin") === "true";
  const monthParam = url.searchParams.get("month");
  const yearParam = url.searchParams.get("year");

  const now = new Date();
  const month = monthParam ? parseInt(monthParam, 10) - 1 : now.getMonth(); // JS month: 0-11
  const year = yearParam ? parseInt(yearParam, 10) : now.getFullYear();

  // 3️⃣ Determinar rango de fechas según mes/año
  const startOfMonth = new Date(year, month, 1);
  const startOfNextMonth = new Date(year, month + 1, 1);

  // 4️⃣ Construir filtro dinámico
  const whereFilter: any = {
    created_at: {
      gte: startOfMonth,
      lt: startOfNextMonth,
    },
  };

  if (!isAdmin) {
    // Solo filtrar por userId si no es admin
    whereFilter.user_id = userId;
  }

  // 5️⃣ Query
  const workEntries = await prisma.workEntry.findMany({
    where: whereFilter,
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