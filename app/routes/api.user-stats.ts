import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import dayjs from "dayjs";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";

// =========================
// GET /api/user-stats → obtener stats del usuario
// =========================
export const loader: LoaderFunction = async ({ request }) => {
  const sessionUserId = await getUserId(request);
  if (!sessionUserId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = (url.searchParams.get("direction") as "next" | "prev") ?? "next";

  const filterUserId = url.searchParams.get("user_id") || undefined;
  const filterMonth = url.searchParams.get("month")
    ? parseInt(url.searchParams.get("month")!, 10)
    : undefined;
  const filterYear = url.searchParams.get("year")
    ? parseInt(url.searchParams.get("year")!, 10)
    : undefined;

  const take = takeParam ? parseInt(takeParam, 10) : 10;

  // Configuración de paginación
  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "id",
    select: undefined,
  });

  // Construcción dinámica de filtros
  const where: any = {};
  if (filterUserId) where.user_id = filterUserId;
  if (filterMonth !== undefined) where.month = filterMonth;
  if (filterYear !== undefined) where.year = filterYear;

  if (Object.keys(where).length > 0) {
    queryOptions.where = where;
  }

  // Incluir usuario relacionado
  queryOptions.include = {
    user: { select: { id: true, name: true, email: true } },
  };

  // Traer stats
  const stats = await prisma.userStats.findMany(queryOptions);
  const { items, pageInfo } = buildPageInfo(stats, take, isBackward, cursor);

  // Cálculo de mes anterior y siguiente solo si hay filtros de mes/año
  let statsInfo = { hasPrevMonth: false, hasNextMonth: false };

  if (filterMonth !== undefined || filterYear !== undefined) {
    const baseDate = dayjs()
      .month(filterMonth !== undefined ? filterMonth - 1 : dayjs().month())
      .year(filterYear ?? dayjs().year());

    const prevMonth = baseDate.subtract(1, "month");
    const nextMonth = baseDate.add(1, "month");

    const [hasPrevMonth, hasNextMonth] = await Promise.all([
      prisma.userStats.count({
        where: {
          user_id: filterUserId,
          month: prevMonth.month() + 1,
          year: prevMonth.year(),
        },
      }),
      prisma.userStats.count({
        where: {
          user_id: filterUserId,
          month: nextMonth.month() + 1,
          year: nextMonth.year(),
        },
      }),
    ]);

    statsInfo = {
      hasPrevMonth: hasPrevMonth > 0,
      hasNextMonth: hasNextMonth > 0,
    };
  }

  return new Response(
    JSON.stringify({ userStats: items, pageInfo, statsInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
// =========================
// POST /api/user-stats → crear/actualizar stats del usuario
// =========================
export const action: ActionFunction = async ({ request }) => {
  const sessionUserId = await getUserId(request);
  if (!sessionUserId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const statsJson = formData.get("stats") as string;

    if (!statsJson) {
      return new Response(
        JSON.stringify({ error: "No stats data provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const parsed = JSON.parse(statsJson);

    const targetUserId = parsed.user_id ?? sessionUserId;
    const month = parsed.month ?? dayjs().month() + 1; // Mes actual por defecto
    const year = parsed.year ?? dayjs().year();         // Año actual por defecto

    // Buscar si ya existe stats para este usuario + mes + año
    const existing = await prisma.userStats.findFirst({
      where: { user_id: targetUserId, month, year },
    });

    let newStats;
    if (existing) {
      newStats = await prisma.userStats.update({
        where: { id: existing.id },
        data: {
          total_work_entries: parsed.total_work_entries ?? existing.total_work_entries,
          companies_as_account_manager: parsed.companies_as_account_manager ?? existing.companies_as_account_manager,
          companies_as_team_member: parsed.companies_as_team_member ?? existing.companies_as_team_member,
          hours_engineering: parsed.hours_engineering ?? existing.hours_engineering,
          hours_architecture: parsed.hours_architecture ?? existing.hours_architecture,
          hours_senior_architecture: parsed.hours_senior_architecture ?? existing.hours_senior_architecture,
        },
      });
    } else {
      newStats = await prisma.userStats.create({
        data: {
          user_id: targetUserId,
          month,
          year,
          total_work_entries: parsed.total_work_entries ?? 0,
          companies_as_account_manager: parsed.companies_as_account_manager ?? 0,
          companies_as_team_member: parsed.companies_as_team_member ?? 0,
          hours_engineering: parsed.hours_engineering ?? 0.0,
          hours_architecture: parsed.hours_architecture ?? 0.0,
          hours_senior_architecture: parsed.hours_senior_architecture ?? 0.0,
        },
      });
    }

    return new Response(JSON.stringify(newStats), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating stats:", error);
    return new Response(
      JSON.stringify({ error: "Error creating/updating stats" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};