// routes/api/users/export-stream.ts
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
  const filter = url.searchParams.get("filter"); // is_account_manager

  const where: any = {};
  if (filter === "is_account_manager") where.is_account_manager = true;

  const encoder = new TextEncoder();
  const csvStream = stringify({
    header: true,
    columns: [
      "name",
      "email",
      "phone",
      "is_admin",
      "is_active",
      "is_account_manager",
      "last_login",
      "createdAt"
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
        const batch = await prisma.user.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: batchSize,
        });

        if (batch.length === 0) break;

        for (const user of batch) {
          csvStream.write({
            name: user.name,
            email: user.email,
            phone: user.phone,
            is_admin: user.is_admin,
            is_active: user.is_active,
            is_account_manager: user.is_account_manager,
            last_login: user.last_login?.toISOString(),
            createdAt: user.createdAt?.toISOString()
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
      "Content-Disposition": `attachment; filename="users.csv"`,
    },
  });
};