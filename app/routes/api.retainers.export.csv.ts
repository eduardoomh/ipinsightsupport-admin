// routes/api/retainers/export-stream.ts
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
  if (userId) where.created_by_id = userId;
  if (filter === "date" && from && to) {
    where.date_activated = { gte: new Date(from), lte: new Date(to) };
  }

  const encoder = new TextEncoder();
  const csvStream = stringify({
    header: true,
    columns: [
      "client",
      "created_by",
      "email",
      "amount",
      "is_credit",
      "date_activated",
      "date_expired",
      "note",
      "created_at",
    ],
  });

  const stream = new ReadableStream({
    async start(controller) {
      csvStream.on("data", (chunk) => controller.enqueue(encoder.encode(chunk)));
      csvStream.on("end", () => controller.close());
      csvStream.on("error", (err) => controller.error(err));

      const batchSize = 5000;
      let skip = 0;

      while (true) {
        const batch = await prisma.retainer.findMany({
          where,
          include: {
            client: { select: { company: true } },
            created_by: { select: { name: true, email: true } },
          },
          orderBy: { date_activated: "desc" },
          skip,
          take: batchSize,
        });

        if (batch.length === 0) break;

        for (const retainer of batch) {
          csvStream.write({
            client: retainer.client.company,
            created_by: retainer.created_by.name,
            email: retainer.created_by.email,
            amount: retainer.amount,
            is_credit: retainer.is_credit,
            date_activated: retainer.date_activated?.toISOString().split("T")[0],
            date_expired: retainer.date_expired?.toISOString().split("T")[0],
            note: retainer.note,
            created_at: retainer.createdAt?.toISOString().split("T")[0],
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
      "Content-Disposition": `attachment; filename="retainers.csv"`,
    },
  });
};