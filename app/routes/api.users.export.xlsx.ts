
// routes/api/users/export-xlsx-stream.ts
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
  const filter = url.searchParams.get("filter");

  const where: any = {};
  if (filter === "is_account_manager") where.is_account_manager = true;

  const passThrough = new PassThrough();
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: passThrough,
    useStyles: true,
    useSharedStrings: true,
  });

  const sheet = workbook.addWorksheet("Users");
  sheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Is Admin", key: "is_admin", width: 10 },
    { header: "Is Active", key: "is_active", width: 10 },
    { header: "Is Account Manager", key: "is_account_manager", width: 15 },
    { header: "Last Login", key: "last_login", width: 20 },
    { header: "Created At", key: "createdAt", width: 20 },
    { header: "Updated At", key: "updatedAt", width: 20 },
  ];

  const batchSize = 2000;
  let skip = 0;

  async function writeData() {
    while (true) {
      const batch = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: batchSize,
      });

      if (batch.length === 0) break;

      for (const user of batch) {
        sheet.addRow({
          name: user.name,
          email: user.email,
          phone: user.phone,
          is_admin: user.is_admin,
          is_active: user.is_active,
          is_account_manager: user.is_account_manager,
          last_login: user.last_login?.toISOString(),
          createdAt: user.createdAt?.toISOString(),
          updatedAt: user.updatedAt?.toISOString(),
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
      "Content-Disposition": `attachment; filename="users.xlsx"`,
    },
  });
};