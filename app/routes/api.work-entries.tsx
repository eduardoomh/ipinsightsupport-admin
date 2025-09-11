import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { WorkEntrySchema } from "~/utils/schemas/workEntrySchema";
import { prisma } from "~/config/prisma.server";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { round2 } from "~/utils/general/round";
import { safeDiv } from "~/utils/general/safediv";
import { getDefaultRates } from "~/utils/general/getDefaultRates";

// GET /api/work-entries → obtener todas las entradas de trabajo
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id"); // filtro opcional por cliente
  const userId = url.searchParams.get("user_id"); // <-- nuevo filtro opcional por usuario
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";

  const take = takeParam ? parseInt(takeParam, 10) : 10;

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "created_at",
    select: undefined, // usamos include
  });

  // Agregamos filtros opcionales
  queryOptions.where = {
    ...(queryOptions.where || {}),
    ...(clientId ? { client_id: clientId } : {}),
    ...(userId ? { user_id: userId } : {}),
  };

  // Incluimos solo los campos necesarios
  queryOptions.include = {
    client: {
      select: {
        id: true,
        company: true,
      },
    },
    user: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  };

  const workEntries = await prisma.workEntry.findMany(queryOptions);

  const { items, pageInfo } = buildPageInfo(workEntries, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ workEntries: items, pageInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// POST /api/work-entries → crear nueva entrada de trabajo con validación Zod
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const workEntryJson = formData.get("workEntry") as string;

  if (!workEntryJson) {
    return new Response(JSON.stringify({ error: "No work entry data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsedInput = JSON.parse(workEntryJson);
    const entry = WorkEntrySchema.parse(parsedInput);

    // 1) Usuario
    const user = await prisma.user.findUnique({ where: { id: entry.user_id } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // 2) TeamMember -> determinar rate_type
    const teamMember = await prisma.teamMember.findFirst({
      where: { client_id: entry.client_id, user_id: entry.user_id },
    });

    let rateType =
      (teamMember?.rate_type as "engineering" | "architecture" | "senior_architecture") ||
      "engineering";

    // 3) Rates del cliente
    const defaultRates = getDefaultRates();
    let engRate = Number(defaultRates.engineering);
    let archRate = Number(defaultRates.architecture);
    let seniorRate = Number(defaultRates.senior_architecture);

    const clientRate = await prisma.clientRates.findFirst({
      where: { clientId: entry.client_id },
    });

    if (clientRate) {
      engRate = Number(clientRate.engineeringRate);
      archRate = Number(clientRate.architectureRate);
      seniorRate = Number(clientRate.seniorArchitectureRate);
    }

    // 4) Determinar rate aplicado
    const rate =
      rateType === "engineering"
        ? engRate
        : rateType === "architecture"
          ? archRate
          : rateType === "senior_architecture"
            ? seniorRate
            : NaN;

    if (!Number.isFinite(rate) || rate <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid rate configuration for this team member" }),
        { status: 400 }
      );
    }

    // 5) Costo y cliente
    const totalCost = rate * entry.hours_billed;

    const client = await prisma.client.findUnique({
      where: { id: entry.client_id },
    });
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), { status: 404 });
    }

    // 6) Calcular saldo y horas estimadas
    const fundsAfter = Number(client.remainingFunds) - totalCost;
    const positiveFunds = Math.max(fundsAfter, 0);

    const estimatedEngineeringHours =
      positiveFunds > 0 ? round2(safeDiv(positiveFunds, engRate)) : 0.0;
    const estimatedArchitectureHours =
      positiveFunds > 0 ? round2(safeDiv(positiveFunds, archRate)) : 0.0;
    const estimatedSeniorArchitectureHours =
      positiveFunds > 0 ? round2(safeDiv(positiveFunds, seniorRate)) : 0.0;

    // 7) Determinar mes y año del workEntry
    const billedDate = new Date(entry.billed_on);
    const month = billedDate.getMonth() + 1; // 1-12
    const year = billedDate.getFullYear();

    // 8) Transacción (WorkEntry + Client + UserStats)
    const [savedEntry, updatedClient, updatedStats] = await prisma.$transaction(async (tx) => {
      // Crear el WorkEntry
      const workEntry = await tx.workEntry.create({
        data: {
          billed_on: billedDate,
          hours_billed: entry.hours_billed,
          hours_spent: entry.hours_spent,
          hourly_rate: rate,
          summary: entry.summary,
          rate_type: rateType,
          client_id: entry.client_id,
          user_id: entry.user_id,
        },
      });

      // Actualizar Client
      const clientUpdated = await tx.client.update({
        where: { id: entry.client_id },
        data: {
          most_recent_work_entry: billedDate,
          remainingFunds: fundsAfter,
          estimated_engineering_hours: estimatedEngineeringHours,
          estimated_architecture_hours: estimatedArchitectureHours,
          estimated_senior_architecture_hours: estimatedSeniorArchitectureHours,
        },
      });

      // Buscar o crear UserStats
      // Buscar o crear UserStats
      let stats = await tx.userStats.findFirst({
        where: { user_id: entry.user_id, month, year },
      });

      if (stats) {
        stats = await tx.userStats.update({
          where: { id: stats.id },
          data: {
            total_work_entries: stats.total_work_entries + 1,
            hours_engineering:
              rateType === "engineering"
                ? stats.hours_engineering + entry.hours_billed
                : stats.hours_engineering,
            hours_architecture:
              rateType === "architecture"
                ? stats.hours_architecture + entry.hours_billed
                : stats.hours_architecture,
            hours_senior_architecture:
              rateType === "senior_architecture"
                ? stats.hours_senior_architecture + entry.hours_billed
                : stats.hours_senior_architecture,
          },
        });
      } else {
        stats = await tx.userStats.create({
          data: {
            user_id: entry.user_id,
            month,
            year,
            total_work_entries: 1,
            companies_as_account_manager: 0,
            companies_as_team_member: 0,
            hours_engineering: rateType === "engineering" ? entry.hours_billed : 0,
            hours_architecture: rateType === "architecture" ? entry.hours_billed : 0,
            hours_senior_architecture:
              rateType === "senior_architecture" ? entry.hours_billed : 0,
          },
        });
      }

      // Buscar o crear AdminStats
      let adminStats = await tx.adminStats.findFirst({
        where: { month, year },
      });

      if (adminStats) {
        adminStats = await tx.adminStats.update({
          where: { id: adminStats.id },
          data: {
            total_work_entries: adminStats.total_work_entries + 1,
            hours_engineering:
              rateType === "engineering"
                ? adminStats.hours_engineering + entry.hours_billed
                : adminStats.hours_engineering,
            hours_architecture:
              rateType === "architecture"
                ? adminStats.hours_architecture + entry.hours_billed
                : adminStats.hours_architecture,
            hours_senior_architecture:
              rateType === "senior_architecture"
                ? adminStats.hours_senior_architecture + entry.hours_billed
                : adminStats.hours_senior_architecture,
            hours_total: adminStats.hours_total + entry.hours_billed,
          },
        });
      } else {
        adminStats = await tx.adminStats.create({
          data: {
            month,
            year,
            total_work_entries: 1,
            total_retainers: 0,
            total_clients: 0,
            retainers_amount: 0,
            hours_total: entry.hours_billed,
            hours_engineering: rateType === "engineering" ? entry.hours_billed : 0,
            hours_architecture: rateType === "architecture" ? entry.hours_billed : 0,
            hours_senior_architecture:
              rateType === "senior_architecture" ? entry.hours_billed : 0,
          },
        });
      }
      return [workEntry, clientUpdated, stats];
    });

    // 9) Respuesta
    return new Response(JSON.stringify({ workEntry: savedEntry, client: updatedClient, stats: updatedStats }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating work entry:", error);
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), { status: 400 });
    }
    return new Response(JSON.stringify({ error: "Error creating work entry" }), { status: 500 });
  }
};