// app/routes/api/clients/report.ts
import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { DateTime } from "luxon";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";

export const loader: LoaderFunction = async ({ request }) => {
  // 1️⃣ Autenticación
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
  const fromQuery = url.searchParams.get("from");
  const toQuery = url.searchParams.get("to");

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  // 2️⃣ Fechas por defecto: mes actual en America/New_York
  const now = DateTime.now().setZone("America/New_York");
  let fromDate = now.startOf("month").startOf("day").toUTC().toJSDate();
  let toDate = now.endOf("month").endOf("day").toUTC().toJSDate();

  // 3️⃣ Sobrescribir si vienen fechas del query
  if (fromQuery && toQuery) {
    fromDate = DateTime.fromISO(fromQuery, { zone: "America/New_York" })
      .startOf("day")
      .toUTC()
      .toJSDate();

    toDate = DateTime.fromISO(toQuery, { zone: "America/New_York" })
      .endOf("day")
      .toUTC()
      .toJSDate();
  }

  // 4️⃣ Filtros separados por tabla
  const whereWorkEntries = {
    billed_on: { gte: fromDate, lte: toDate },
    created_at: { gte: fromDate, lte: toDate },
  };

  const whereClients = {
    createdAt: { gte: fromDate, lte: toDate },
  };

  // 5️⃣ Paginación
  const defaultSelect = { id: true, company: true };
  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: defaultSelect,
  });

  // 6️⃣ Traer clientes paginados
  const clients = await prisma.client.findMany({
    where: whereClients,
    ...queryOptions,
  });

  // 7️⃣ Para cada cliente, calcular totales y detalles de workEntry
  const clientsWithTotals = (
    await Promise.all(
      clients.map(async (c) => {
        const aggregation = await prisma.workEntry.aggregate({
          where: { client_id: c.id, ...whereWorkEntries },
          _sum: { hours_billed: true, hours_spent: true },
        });

        const entries = await prisma.workEntry.findMany({
          where: { client_id: c.id, ...whereWorkEntries },
          select: { hours_billed: true, hourly_rate: true, rate_type: true },
        });

        if (entries.length === 0) return null;

        const total_price = entries.reduce(
          (sum, e) => sum + e.hours_billed * e.hourly_rate,
          0
        );

        const rate_types = Array.from(new Set(entries.map((e) => e.rate_type)));

        return {
          id: c.id,
          company: c.company,
          total_hours_billed: aggregation._sum.hours_billed || 0,
          total_hours_spent: aggregation._sum.hours_spent || 0,
          total_price,
          rate_types,
        };
      })
    )
  ).filter(Boolean);

  // 8️⃣ Construir pageInfo y devolver
  const { items, pageInfo } = buildPageInfo(clientsWithTotals, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ clients: items, pageInfo }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};