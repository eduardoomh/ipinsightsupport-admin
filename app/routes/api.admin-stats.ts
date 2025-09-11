import { ActionFunction, LoaderFunction } from "@remix-run/node";
import dayjs from "dayjs";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const monthParam = url.searchParams.get("month");
    const yearParam = url.searchParams.get("year");
  
    const month = monthParam ? parseInt(monthParam, 10) : undefined;
    const year = yearParam ? parseInt(yearParam, 10) : undefined;
  
    // Validación básica
    if (month && (month < 1 || month > 12)) {
      return new Response(JSON.stringify({ error: "Invalid month" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    // Filtro dinámico
    const where: any = {};
    if (month) where.month = month;
    if (year) where.year = year;
  
    // Obtener estadísticas (pueden ser varias si no filtras por mes/año)
    const stats = await prisma.adminStats.findMany({
      where,
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  
    // Calcular prev/next solo si se filtra un período
    let statsInfo = { hasPrevMonth: false, hasNextMonth: false };
    if (month || year) {
      const baseDate = dayjs()
        .month(month ? month - 1 : dayjs().month())
        .year(year ?? dayjs().year());
  
      const prevMonth = baseDate.subtract(1, "month");
      const nextMonth = baseDate.add(1, "month");
  
      const [hasPrevMonth, hasNextMonth] = await Promise.all([
        prisma.adminStats.findFirst({
          where: {
            month: prevMonth.month() + 1,
            year: prevMonth.year(),
          },
          select: { id: true },
        }),
        prisma.adminStats.findFirst({
          where: {
            month: nextMonth.month() + 1,
            year: nextMonth.year(),
          },
          select: { id: true },
        }),
      ]);
  
      statsInfo = {
        hasPrevMonth: !!hasPrevMonth,
        hasNextMonth: !!hasNextMonth,
      };
    }
  
    return new Response(
      JSON.stringify({ adminStats: stats, statsInfo }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  };


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
      return new Response(JSON.stringify({ error: "No stats data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(statsJson);

    const month = parsed.month ?? dayjs().month() + 1; // Mes actual por defecto
    const year = parsed.year ?? dayjs().year();        // Año actual por defecto

    // Buscar si ya existe stats para este mes + año
    const existing = await prisma.adminStats.findFirst({
      where: { month, year },
    });

    let newStats;
    if (existing) {
      newStats = await prisma.adminStats.update({
        where: { id: existing.id },
        data: {
          total_work_entries: parsed.total_work_entries ?? existing.total_work_entries,
          total_retainers: parsed.total_retainers ?? existing.total_retainers,
          total_clients: parsed.total_clients ?? existing.total_clients,
          retainers_amount: parsed.retainers_amount ?? existing.retainers_amount,
          hours_total: parsed.hours_total ?? existing.hours_total,
          hours_engineering: parsed.hours_engineering ?? existing.hours_engineering,
          hours_architecture: parsed.hours_architecture ?? existing.hours_architecture,
          hours_senior_architecture: parsed.hours_senior_architecture ?? existing.hours_senior_architecture,
        },
      });
    } else {
      newStats = await prisma.adminStats.create({
        data: {
          month,
          year,
          total_work_entries: parsed.total_work_entries ?? 0,
          total_retainers: parsed.total_retainers ?? 0,
          total_clients: parsed.total_clients ?? 0,
          retainers_amount: parsed.retainers_amount ?? 0.0,
          hours_total: parsed.hours_total ?? 0.0,
          hours_engineering: parsed.hours_engineering ?? 0.0,
          hours_architecture: parsed.hours_architecture ?? 0.0,
          hours_senior_architecture: parsed.hours_senior_architecture ?? 0.0,
        },
      });
    }

    return new Response(JSON.stringify(newStats), {
      status: existing ? 200 : 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating/updating AdminStats:", error);
    return new Response(
      JSON.stringify({ error: "Error creating/updating AdminStats" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};