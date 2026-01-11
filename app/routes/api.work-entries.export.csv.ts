// routes/api/work-entries/export-stream.ts
import { LoaderFunction } from "@remix-run/node";
import { stringify } from "csv-stringify";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const userId = url.searchParams.get("user_id");
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = {};
  if (clientId) where.client_id = clientId;
  if (userId) where.user_id = userId;
  if (filter === "date" && from && to) {
    where.billed_on = { gte: new Date(from), lte: new Date(to) };
  }

  const encoder = new TextEncoder();
  const csvStream = stringify({ header: true, columns: [
    "company", "user", "email", "billed_on", "rate_type", "hours_billed", "hours_spent", "hourly_rate", "total", "description", "created_at"
  ] });

  const stream = new ReadableStream({
    async start(controller) {
      csvStream.on("data", (chunk) => controller.enqueue(encoder.encode(chunk)));
      csvStream.on("end", () => controller.close());
      csvStream.on("error", (err) => controller.error(err));

      const batchSize = 5000;
      let skip = 0;

      while (true) {
        const batch = await prisma.workEntry.findMany({
          where,
          include: { client: { select: { company: true } }, user: { select: { name: true, email: true } } },
          orderBy: { created_at: "desc" },
          skip,
          take: batchSize,
        });

        if (batch.length === 0) break;

        for (const entry of batch) {
          csvStream.write({
            company: entry.client.company,
            user: entry.user.name,
            email: entry.user.email,
            billed_on: entry.billed_on?.toISOString().split("T")[0],
            rate_type: entry.rate_type,
            hours_billed: entry.hours_billed,
            hours_spent: entry.hours_spent,
            hourly_rate: entry.hourly_rate,
            total: entry.hours_billed * entry.hourly_rate,
            description: entry.summary,
            created_at: entry.created_at?.toISOString().split("T")[0],
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
      "Content-Disposition": `attachment; filename="work-entries.csv"`,
    },
  });
};