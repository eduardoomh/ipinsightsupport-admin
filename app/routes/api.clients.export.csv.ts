// routes/api/clients/export-stream.ts
import { LoaderFunction } from "@remix-run/node";
import { stringify } from "csv-stringify";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const userIdFilter = url.searchParams.get("user_id");
  const statusFilter = url.searchParams.get("currentStatus");
  const filter = url.searchParams.get("filter"); // "recent" | "date"
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = {};
  if (userIdFilter) where.account_manager_id = userIdFilter;
  if (statusFilter) where.currentStatus = statusFilter;

  // Filtro por rango de fechas
  if (filter === "date" && from && to) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);

    const endExclusive = new Date(to);
    endExclusive.setHours(0, 0, 0, 0);
    endExclusive.setDate(endExclusive.getDate() + 1); // incluir todo el día "to"

    where.createdAt = {
      gte: start,
      lt: endExclusive,
    };
  }

  const encoder = new TextEncoder();
  const csvStream = stringify({
    header: true,
    columns: [
      "company",
      "timezone",
      "currentStatus",
      "remainingFunds",
      "most_recent_work_entry",
      "most_recent_retainer_activated",
      "estimated_engineering_hours",
      "estimated_architecture_hours",
      "estimated_senior_architecture_hours",
      "createdAt",
      "account_manager",
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      csvStream.on("data", (chunk) => controller.enqueue(encoder.encode(chunk)));
      csvStream.on("end", () => controller.close());
      csvStream.on("error", (err) => controller.error(err));

      const batchSize = 2000;
      let skip = 0;

      while (true) {
        const batch = await prisma.client.findMany({
          where,
          include: {
            account_manager: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: batchSize,
        });

        if (batch.length === 0) break;

        for (const client of batch) {
          csvStream.write({
            company: client.company,
            timezone: client.timezone,
            currentStatus: client.currentStatus,
            remainingFunds: client.remainingFunds,
            most_recent_work_entry: client.most_recent_work_entry?.toISOString().split("T")[0],
            most_recent_retainer_activated: client.most_recent_retainer_activated?.toISOString().split("T")[0],
            estimated_engineering_hours: client.estimated_engineering_hours,
            estimated_architecture_hours: client.estimated_architecture_hours,
            estimated_senior_architecture_hours: client.estimated_senior_architecture_hours,
            createdAt: client.createdAt?.toISOString().split("T")[0],
            account_manager: client.account_manager?.name,
          });
        }

        skip += batchSize;
      }

      csvStream.end();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="clients.csv"`,
    },
  });
};