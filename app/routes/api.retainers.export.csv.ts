// routes/api/retainers/export-stream.ts
import { LoaderFunction } from "@remix-run/node";
import { stringify } from "csv-stringify";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const userId = url.searchParams.get("user_id");
  const filter = url.searchParams.get("filter"); // "recent" o "date"
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const isCreditParam = url.searchParams.get("is_credit"); // "true" | "false" | null

  const where: any = {};

  // 🔹 Filtro por compañía
  if (clientId) {
    where.client_id = clientId;
  }

  // 🔹 Filtro por usuario
  if (userId) {
    where.created_by_id = userId;
  }

  // 🔹 Filtro por rango de fechas
  if (filter === "date" && from && to) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(to);
    end.setHours(23, 59, 59, 999); // incluir todo el día "to"

    where.date_activated = {
      gte: start,
      lte: end,
    };
  }

  // Filtro por crédito/débito
  if (isCreditParam === "true") {
    where.is_credit = true;
  } else if (isCreditParam === "false") {
    where.is_credit = false;
  }
  // si isCreditParam es null, no se aplica ningún filtro
  // si isCreditParam es null/undefined, no se filtra por is_credit

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
            client: retainer.client?.company ?? "",
            created_by: retainer.created_by?.name ?? "",
            email: retainer.created_by?.email ?? "",
            amount: retainer.amount ?? 0,
            is_credit: retainer.is_credit ?? false,
            date_activated: retainer.date_activated
              ? retainer.date_activated.toISOString().split("T")[0]
              : "",
            date_expired: retainer.date_expired
              ? retainer.date_expired.toISOString().split("T")[0]
              : "",
            note: retainer.note ?? "",
            created_at: retainer.createdAt
              ? retainer.createdAt.toISOString().split("T")[0]
              : "",
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