// routes/api/contacts/export-stream.ts
import { LoaderFunction } from "@remix-run/node";
import { stringify } from "csv-stringify";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const filter = url.searchParams.get("filter");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  const where: any = {};
  if (clientId) where.client_id = clientId;
  if (filter === "date" && from && to) {
    where.createdAt = { gte: new Date(from), lte: new Date(to) };
  }

  const encoder = new TextEncoder();
  const csvStream = stringify({
    header: true,
    columns: ["name", "email", "phone", "client", "createdAt"],
  });

  const stream = new ReadableStream({
    async start(controller) {
      csvStream.on("data", (chunk) => controller.enqueue(encoder.encode(chunk)));
      csvStream.on("end", () => controller.close());
      csvStream.on("error", (err) => controller.error(err));

      const batchSize = 5000;
      let skip = 0;

      while (true) {
        const batch = await prisma.contact.findMany({
          where,
          include: { client: { select: { company: true } } },
          orderBy: { createdAt: "desc" },
          skip,
          take: batchSize,
        });

        if (batch.length === 0) break;

        for (const contact of batch) {
          csvStream.write({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            client: contact.client?.company,
            createdAt: contact.createdAt?.toISOString().split("T")[0],
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
      "Content-Disposition": `attachment; filename="contacts.csv"`,
    },
  });
};