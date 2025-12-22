// app/routes/api/retainers.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { getDefaultRates } from "~/utils/general/getDefaultRates";
import { round2 } from "~/utils/general/round";
import { safeDiv } from "~/utils/general/safediv";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { RetainerSchema } from "~/utils/schemas/retainerSchema";

// GET /api/retainers → obtener todos los retainers
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const createdById = url.searchParams.get("user_id");
  const filter = url.searchParams.get("filter"); // "recent" or "date"
  const from = url.searchParams.get("from"); // expected YYYY-MM-DD
  const to = url.searchParams.get("to");     // expected YYYY-MM-DD
  const isCreditParam = url.searchParams.get("is_credit");
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "date_activated",
    select: undefined,
  });

  // Construimos where limpio
  const where: any = { ...(queryOptions.where || {}) };

  // company / user filters
  if (clientId) where.client_id = clientId;
  if (createdById) where.created_by_id = createdById;

  // fecha: usar startOfDay(from) y endExclusive = startOfDay(next day after to)
  if (filter === "date" && from && to) {
    // parsear fechas (esperamos YYYY-MM-DD). Usamos objetos Date y normalizamos.
    const start = new Date(from);
    start.setHours(0, 0, 0, 0);

    const endExclusive = new Date(to);
    endExclusive.setHours(0, 0, 0, 0);
    endExclusive.setDate(endExclusive.getDate() + 1); // inicio del día siguiente

    where.date_activated = {
      gte: start,
      lt: endExclusive, // < inicio del día siguiente -> incluye todo el día "to"
    };

    // opcional: debug para verificar valores de start/end
    // console.debug("date filter", { from, to, start: start.toISOString(), endExclusive: endExclusive.toISOString() });
  }

  // is_credit
  if (isCreditParam !== null) {
    // convertimos "true"/"false" a boolean
    where.is_credit = isCreditParam === "true";
  }

  // asignamos where a queryOptions
  queryOptions.where = where;

  // include relations
  queryOptions.include = {
    client: { select: { id: true, company: true } },
    created_by: { select: { id: true, name: true, email: true } },
  };

  const balances = await prisma.retainer.findMany(queryOptions);
  const { items, pageInfo } = buildPageInfo(balances, take, isBackward, cursor);

  return new Response(JSON.stringify({ balances: items, pageInfo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/retainers → crear un nuevo retainer
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const retainerJson = formData.get("retainer") as string;

  if (!retainerJson) {
    return new Response(JSON.stringify({ error: "No retainer data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = RetainerSchema.parse(JSON.parse(retainerJson));
    const defaultRates = getDefaultRates()

    let engRate = defaultRates.engineering;
    let archRate = defaultRates.architecture;
    let seniorRate = defaultRates.senior_architecture;

    // 1) Obtener clientRates para calcular estimaciones
    const clientRate = await prisma.clientRates.findFirst({
      where: { clientId: parsed.client_id },
    });

    // Normalizamos rates
    if (clientRate) {
      engRate = Number(clientRate.engineeringRate);
      archRate = Number(clientRate.architectureRate);
      seniorRate = Number(clientRate.seniorArchitectureRate);
    }

    // 2) Obtener cliente actual para sumar fondos
    const client = await prisma.client.findUnique({
      where: { id: parsed.client_id },
    });
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Nuevo saldo después de aplicar el retainer
    const fundsAfter = Number(client.remainingFunds) + parsed.amount;
    const positiveFunds = Math.max(fundsAfter, 0);

    // Calcular estimaciones
    const estimatedEngineeringHours =
      positiveFunds > 0 && engRate > 0 ? round2(safeDiv(positiveFunds, engRate)) : 0.0;

    const estimatedArchitectureHours =
      positiveFunds > 0 && archRate > 0 ? round2(safeDiv(positiveFunds, archRate)) : 0.0;

    const estimatedSeniorArchitectureHours =
      positiveFunds > 0 && seniorRate > 0 ? round2(safeDiv(positiveFunds, seniorRate)) : 0.0;

    // Construir el objeto data del retainer
    const retainerData: any = {
      amount: parsed.amount,
      date_activated: new Date(parsed.date_activated),
      date_expired: new Date(
        new Date(parsed.date_activated).setFullYear(
          new Date(parsed.date_activated).getFullYear() + 1
        )
      ),
      is_credit: parsed.is_credit,
      client: { connect: { id: parsed.client_id } },
      created_by: { connect: { id: parsed.created_by_id } },
    };

    if (parsed.note) {
      retainerData.note = parsed.note;
    }

    // Ejecutar la creación del retainer y la actualización del cliente en una transacción

    const activatedDate = new Date(parsed.date_activated);
    const month = activatedDate.getMonth() + 1;
    const year = activatedDate.getFullYear();

    const [newRetainer, updatedClient, updatedAdminStats] = await prisma.$transaction(async (tx) => {
      // Crear el Retainer
      const retainer = await tx.retainer.create({ data: retainerData });

      // Actualizar Cliente
      const clientUpdated = await tx.client.update({
        where: { id: parsed.client_id },
        data: {
          remainingFunds: fundsAfter,
          most_recent_retainer_activated: activatedDate,
          estimated_engineering_hours: estimatedEngineeringHours,
          estimated_architecture_hours: estimatedArchitectureHours,
          estimated_senior_architecture_hours: estimatedSeniorArchitectureHours,
        },
      });

      // Actualizar AdminStats
      let adminStats = await tx.adminStats.findFirst({
        where: { month, year },
      });

      if (adminStats) {
        adminStats = await tx.adminStats.update({
          where: { id: adminStats.id },
          data: {
            total_retainers: adminStats.total_retainers + 1,
            retainers_amount: adminStats.retainers_amount + parsed.amount,
          },
        });
      } else {
        adminStats = await tx.adminStats.create({
          data: {
            month,
            year,
            total_work_entries: 0,
            total_retainers: 1,
            total_clients: 0,
            retainers_amount: parsed.amount,
            hours_total: 0,
            hours_engineering: 0,
            hours_architecture: 0,
            hours_senior_architecture: 0,
          },
        });
      }

      return [retainer, clientUpdated, adminStats];
    });

    return new Response(JSON.stringify(newRetainer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating retainer:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error && "errors" in error
            ? (error as any).errors
            : "Error creating retainer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};