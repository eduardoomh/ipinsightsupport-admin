import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { DateTime } from "luxon";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";
  const from = url.searchParams.get("from"); // fecha inicio opcional
  const to = url.searchParams.get("to");     // fecha fin opcional
  const take = takeParam ? parseInt(takeParam, 10) : 6;

  // Campos base que queremos seleccionar
  const defaultSelect = {
    id: true,
    name: true,
  };

  // Construimos query de paginación
  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: defaultSelect,
  });

  // Traemos los usuarios paginados
  const users = await prisma.user.findMany(queryOptions);

  // 2️⃣ Fechas por defecto: mes actual en America/New_York
  const now = DateTime.now().setZone("America/New_York");
  let fromDate = now.startOf("month").startOf("day").toUTC().toJSDate();
  let toDate = now.endOf("month").endOf("day").toUTC().toJSDate();

  // 3️⃣ Sobrescribir si vienen fechas del query
  if (from && to) {
    fromDate = DateTime.fromISO(from, { zone: "America/New_York" })
      .startOf("day")
      .toUTC()
      .toJSDate();

    toDate = DateTime.fromISO(to, { zone: "America/New_York" })
      .endOf("day")
      .toUTC()
      .toJSDate();
  }

  const whereWorkEntries = {
    billed_on: { gte: fromDate, lte: toDate }
  };

  // Calculamos sumas por usuario y filtramos los que tienen totales > 0
  const usersWithTotals = (
    await Promise.all(
      users.map(async (u) => {
        const aggregation = await prisma.workEntry.aggregate({
          where: {
            user_id: u.id,
            ...whereWorkEntries,
          },
          _sum: {
            hours_billed: true,
            hours_spent: true,
          },
        });

        const total_hours_billed = aggregation._sum.hours_billed || 0;
        const total_hours_spent = aggregation._sum.hours_spent || 0;

        if (total_hours_billed === 0 && total_hours_spent === 0) return null;

        return {
          id: u.id,
          name: u.name,
          total_hours_billed,
          total_hours_spent,
        };
      })
    )
  ).filter(Boolean);

  // Construimos la info de paginación
  const { items, pageInfo } = buildPageInfo(usersWithTotals, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ users: items, pageInfo }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};