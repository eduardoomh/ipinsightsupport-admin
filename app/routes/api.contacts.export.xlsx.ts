// routes/api/contacts/export-xlsx-stream.ts
import { LoaderFunction } from "@remix-run/node";
import ExcelJS from "exceljs";
import { prisma } from "~/config/prisma.server";
import { PassThrough } from "stream";

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

  const passThrough = new PassThrough();
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
    useStyles: true,
    useSharedStrings: true,
  });

  const sheet = workbook.addWorksheet("Contacts");
  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 25 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Client", key: "client", width: 20 },
    { header: "Created At", key: "createdAt", width: 15 },
  ];

  const batchSize = 2000;
  let skip = 0;

  async function writeData() {
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
        sheet.addRow({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          client: contact.client?.company,
          createdAt: contact.createdAt?.toISOString().split("T")[0],
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
      "Content-Disposition": `attachment; filename="contacts.xlsx"`,
    },
  });
};