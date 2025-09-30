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
  const clientId = url.searchParams.get("client_id");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "client_id is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Rango de fechas en horario de Florida
  let whereWorkEntries: any = { client_id: clientId };
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

  // Obtener work entries del cliente con datos relevantes
  const workEntries = await prisma.workEntry.findMany({
    where: whereWorkEntries,
    select: {
      id: true,
      billed_on: true,
      hours_billed: true,
      hours_spent: true,
      hourly_rate: true,
      rate_type: true,
      summary: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      }
    },
    orderBy: { billed_on: "asc" },
  });

  // Agregar el precio total a cada work entry
  const workEntriesWithTotal = workEntries.map((entry) => ({
    ...entry,
    total_price: (entry.hours_billed || 0) * (entry.hourly_rate || 0),
  }));

  return new Response(
    JSON.stringify({
      clientId,
      workEntries: workEntriesWithTotal,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};