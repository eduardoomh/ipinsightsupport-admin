// routes/api/retainers/export-xlsx-stream.ts
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
  const isCreditParam = url.searchParams.get("is_credit");

  const where: any = {};

  // Filtro por compañía
  if (clientId) where.client_id = clientId;

  // Filtro por usuario
  if (userId) where.created_by_id = userId;

  // Filtro por rango de fechas
  if (filter === "date" && from && to) {
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);

    const endExclusive = new Date(to);
    endExclusive.setHours(0, 0, 0, 0);
    endExclusive.setDate(endExclusive.getDate() + 1); // incluye todo el día "to"

    where.date_activated = {
      gte: start,
      lt: endExclusive,
    };
  }

  // Filtro crédito/débito
  if (isCreditParam !== null) {
    where.is_credit = isCreditParam === "true";
  }

  const passThrough = new PassThrough();

  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
    useStyles: true,
    useSharedStrings: true,
  });

  const sheet = workbook.addWorksheet("Retainers");
  sheet.columns = [
    { header: "Company", key: "company", width: 20 },
    { header: "Created By", key: "created_by", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Is Credit", key: "is_credit", width: 10 },
    { header: "Date Activated", key: "date_activated", width: 15 },
    { header: "Date Expired", key: "date_expired", width: 15 },
    { header: "Note", key: "note", width: 40 },
    { header: "Created At", key: "created_at", width: 20 },
  ];

  const batchSize = 2000;
  let skip = 0;

  async function writeData() {
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
        sheet.addRow({
          company: retainer.client.company,
          created_by: retainer.created_by.name,
          email: retainer.created_by.email,
          amount: retainer.amount,
          is_credit: retainer.is_credit ? "SI" : "NO",
          date_activated: retainer.date_activated?.toISOString().split("T")[0],
          date_expired: retainer.date_expired?.toISOString().split("T")[0],
          note: retainer.note,
          created_at: retainer.createdAt?.toISOString().split("T")[0],
        }).commit();
      }

      skip += batchSize;
    }

    await sheet.commit();
    await workbook.commit();
  }

  writeData().catch((err) => passThrough.destroy(err));

  return new Response(passThrough as any, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="retainers.xlsx"`,
    },
  });
};