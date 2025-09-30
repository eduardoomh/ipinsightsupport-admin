import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { DateTime } from "luxon";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUserId = await getUserId(request);
  if (!sessionUserId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const userId = url.searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "user_id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Rango de fechas en horario de Florida
  let whereWorkEntries: any = { user_id: userId };
  if (from && to) {
    const fromDate = DateTime.fromISO(from, { zone: "America/New_York" })
      .startOf("day")
      .toUTC()
      .toJSDate();
    const toDate = DateTime.fromISO(to, { zone: "America/New_York" })
      .endOf("day")
      .toUTC()
      .toJSDate();

    whereWorkEntries.billed_on = { gte: fromDate, lte: toDate };
  }

  // Obtener todos los work entries del usuario
  const workEntries = await prisma.workEntry.findMany({
    where: whereWorkEntries,
    select: {
      id: true,
      billed_on: true,
      hours_billed: true,
      hours_spent: true,
      hourly_rate: true,
      summary: true,
      rate_type: true,
      client: {
        select: {
          id: true,
          company: true,
        },
      },
    },
    orderBy: { billed_on: "asc" },
  });

  // Agregamos el precio total por work entry
  const workEntriesWithTotal = workEntries.map((entry) => ({
    ...entry,
    total_price: (entry.hours_billed || 0) * (entry.hourly_rate || 0),
  }));

  // Obtener todos los clientes donde el usuario fue account manager
  const managedClients = await prisma.client.findMany({
    where: { account_manager_id: userId },
    select: {
      id: true,
      company: true,
    },
  });

  return new Response(
    JSON.stringify({
      workEntries: workEntriesWithTotal,
      managedClients,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};