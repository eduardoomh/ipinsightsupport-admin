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

    // 2) TeamMember -> rate_type real para este cliente
    const teamMember = await prisma.teamMember.findFirst({
      where: { client_id: entry.client_id, user_id: entry.user_id },
    });

    let rateType = teamMember?.rate_type as "engineering" | "architecture" | "senior_architecture" || "engineering";

    // 3) Rates del cliente
    const defaultRates = getDefaultRates()
    let engRate = Number(defaultRates.engineering);
    let archRate = Number(defaultRates.architecture);
    let seniorRate = Number(defaultRates.senior_architecture);

    const clientRate = await prisma.clientRates.findFirst({ where: { clientId: entry.client_id } });
    
    if (clientRate) {
      engRate = Number(clientRate.engineeringRate);
      archRate = Number(clientRate.architectureRate);
      seniorRate = Number(clientRate.seniorArchitectureRate);
    }


    // 4) Rate aplicado al entry (según rateType del teamMember)
    const rate =
      rateType === "engineering" ? engRate :
        rateType === "architecture" ? archRate :
          rateType === "senior_architecture" ? seniorRate :
            NaN;

    if (!Number.isFinite(rate) || rate <= 0) {
      return new Response(JSON.stringify({ error: "Invalid rate configuration for this team member" }), { status: 400 });
    }

    // 5) Costo y cliente
    const totalCost = rate * entry.hours_billed;

    const client = await prisma.client.findUnique({ where: { id: entry.client_id } });
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), { status: 404 });
    }

    // 6) Saldo restante (puede ser negativo)
    const fundsAfter = Number(client.remainingFunds) - totalCost;
    const positiveFunds = Math.max(fundsAfter, 0);

    const estimatedEngineeringHours = positiveFunds > 0 ? round2(safeDiv(positiveFunds, engRate)) : 0.0;
    const estimatedArchitectureHours = positiveFunds > 0 ? round2(safeDiv(positiveFunds, archRate)) : 0.0;
    const estimatedSeniorArchitectureHours = positiveFunds > 0 ? round2(safeDiv(positiveFunds, seniorRate)) : 0.0;

    // 8) Transacción
    const [savedEntry, updatedClient] = await prisma.$transaction([
      prisma.workEntry.create({
        data: {
          billed_on: new Date(entry.billed_on),
          hours_billed: entry.hours_billed,
          hours_spent: entry.hours_spent,
          hourly_rate: rate,
          summary: entry.summary,
          rate_type: rateType,
          client_id: entry.client_id,
          user_id: entry.user_id,
        },
      }),
      prisma.client.update({
        where: { id: entry.client_id },
        data: {
          most_recent_work_entry: new Date(entry.billed_on),
          remainingFunds: fundsAfter,
          estimated_engineering_hours: estimatedEngineeringHours,
          estimated_architecture_hours: estimatedArchitectureHours,
          estimated_senior_architecture_hours: estimatedSeniorArchitectureHours,
        },
      }),
    ]);

    // Devuelve ambos para que verifiques que sí se guardó
    return new Response(JSON.stringify({ workEntry: savedEntry, client: updatedClient }), {
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