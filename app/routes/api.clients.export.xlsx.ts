// routes/api/clients/export-xlsx-stream.ts
import { LoaderFunction } from "@remix-run/node";
import ExcelJS from "exceljs";
import { prisma } from "~/config/prisma.server";
import { PassThrough } from "stream";
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

  const passThrough = new PassThrough();
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
    useStyles: true,
    useSharedStrings: true,
  });

  const sheet = workbook.addWorksheet("Clients");
  sheet.columns = [
    { header: "Company", key: "company", width: 25 },
    { header: "Timezone", key: "timezone", width: 15 },
    { header: "Current Status", key: "currentStatus", width: 20 },
    { header: "Remaining Funds", key: "remainingFunds", width: 15 },
    { header: "Most Recent Work Entry", key: "most_recent_work_entry", width: 15 },
    { header: "Most Recent Retainer Activated", key: "most_recent_retainer_activated", width: 15 },
    { header: "Estimated Engineering Hours", key: "estimated_engineering_hours", width: 15 },
    { header: "Estimated Architecture Hours", key: "estimated_architecture_hours", width: 15 },
    { header: "Estimated Senior Architecture Hours", key: "estimated_senior_architecture_hours", width: 15 },
    { header: "Created At", key: "createdAt", width: 15 },
    { header: "Account Manager", key: "account_manager", width: 20 },
  ];

  const batchSize = 2000;
  let skip = 0;

  async function writeData() {
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
        sheet.addRow({
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
      "Content-Disposition": `attachment; filename="clients.xlsx"`,
    },
  });
};