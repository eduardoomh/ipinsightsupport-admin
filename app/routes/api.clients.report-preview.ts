// app/routes/api/clients/report.ts
import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { DateTime } from "luxon";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const takeParam = url.searchParams.get("take");
    const direction = url.searchParams.get("direction") as "next" | "prev";
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const take = takeParam ? parseInt(takeParam, 10) : 6;

    let whereWorkEntries: any = {};
    let whereClients: any = {};
    if (from && to) {
        const fromDate = DateTime.fromISO(from, { zone: "America/New_York" })
            .startOf("day")
            .toUTC()
            .toJSDate();

        const toDate = DateTime.fromISO(to, { zone: "America/New_York" })
            .endOf("day")
            .toUTC()
            .toJSDate();

        whereWorkEntries.billed_on = {
            gte: fromDate,
            lte: toDate,
        };
        whereClients.createdAt = {
            gte: fromDate,
            lte: toDate,
        };

    }

    // convertimos a rango en UTC (desde horario de Florida)

    // base select para la paginación
    const defaultSelect = {
        id: true,
        company: true,
    };

    const { queryOptions, isBackward } = buildCursorPaginationQuery({
        cursor,
        take,
        direction,
        orderByField: "createdAt",
        select: defaultSelect,
    });

    // traemos clientes paginados
    const clients = await prisma.client.findMany(queryOptions);

    // para cada cliente, agregamos los totales en el rango
    const clientsWithTotals = (
        await Promise.all(
            clients.map(async (c) => {
                const aggregation = await prisma.workEntry.aggregate({
                    where: {
                        client_id: c.id,
                        ...whereClients,
                    },
                    _sum: {
                        hours_billed: true,
                        hours_spent: true,
                    },
                });
                // workEntries para tipos y precio total
                const entries = await prisma.workEntry.findMany({
                    where: {
                        client_id: c.id,
                        ...whereWorkEntries,
                    },
                    select: {
                        hours_billed: true,
                        hourly_rate: true,
                        rate_type: true,
                    },
                });

                const total_hours_billed = aggregation._sum.hours_billed || 0;
                const total_hours_spent = aggregation._sum.hours_spent || 0;

                if (entries.length === 0) return null;

                const total_price = entries.reduce(
                    (sum, e) => sum + e.hours_billed * e.hourly_rate,
                    0
                );
                const rate_types = Array.from(new Set(entries.map((e) => e.rate_type)));

                return {
                    id: c.id,
                    company: c.company,
                    total_hours_billed,
                    total_hours_spent,
                    total_price,
                    rate_types,
                };
            })
        )
    ).filter(Boolean);
    const { items, pageInfo } = buildPageInfo(
        clientsWithTotals,
        take,
        isBackward,
        cursor
    );
    return new Response(
        JSON.stringify({ clients: items, pageInfo }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
};