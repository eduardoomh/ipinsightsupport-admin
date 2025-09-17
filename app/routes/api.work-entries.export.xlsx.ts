// routes/api/work-entries/export-xlsx-stream.ts
import { LoaderFunction } from "@remix-run/node";
import ExcelJS from "exceljs";
import { prisma } from "~/config/prisma.server";
import { PassThrough } from "stream";

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

  // Creamos un PassThrough stream para enviar directamente a HTTP
  const passThrough = new PassThrough();

  // Configuramos el workbook con stream de salida
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
    useStyles: true,
    useSharedStrings: true,
  });

  const sheet = workbook.addWorksheet("Work Entries");
  sheet.columns = [
    { header: "Client", key: "client", width: 20 },
    { header: "User", key: "user", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Billed On", key: "billed_on", width: 15 },
    { header: "Rate Type", key: "rate_type", width: 10 },
    { header: "Hours Billed", key: "hours_billed", width: 10 },
    { header: "Hours Spent", key: "hours_spent", width: 10 },
    { header: "Hourly Rate", key: "hourly_rate", width: 10 },
    { header: "Description", key: "description", width: 40 },
    { header: "created At", key: "created_at", width: 40 },
  ];

  // Escribimos los datos en batch
  const batchSize = 2000;
  let skip = 0;

  async function writeData() {
    while (true) {
      const batch = await prisma.workEntry.findMany({
        where,
        include: {
          client: { select: { company: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: batchSize,
      });

      if (batch.length === 0) break;

      for (const entry of batch) {
        sheet.addRow({
          client: entry.client.company,
          user: entry.user.name,
          email: entry.user.email,
          billed_on: entry.billed_on?.toISOString().split("T")[0],
          rate_type: entry.rate_type,
          hours_billed: entry.hours_billed,
          hours_spent: entry.hours_spent,
          hourly_rate: entry.hourly_rate,
          description: entry.summary,
          created_at: entry.created_at?.toISOString().split("T")[0],
        }).commit();
      }

      skip += batchSize;
    }

    await sheet.commit();
    await workbook.commit();
  }

  // Lanzamos la escritura sin bloquear
  writeData().catch((err) => passThrough.destroy(err));

  return new Response(passThrough as any, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="work-entries.xlsx"`,
    },
  });
};