import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { WorkEntrySchema } from "~/utils/schemas/workEntrySchema";
import { prisma } from "~/config/prisma.server";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";

// GET /api/work-entries → obtener todas las entradas de trabajo
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id"); // <-- nuevo filtro opcional
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

  // Agregamos filtro por client_id si existe
  if (clientId) {
    queryOptions.where = {
      ...(queryOptions.where || {}),
      client_id: clientId,
    };
  }

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

console.log("step 1", workEntryJson)
  try {
    const parsedInput = JSON.parse(workEntryJson);
console.log("step 0.5")
    // Validar con Zod
    const entry = WorkEntrySchema.parse(parsedInput);
console.log("step 0.6")
    // 1️⃣ Obtener usuario completo
    console.log("step 1.1")
    const user = await prisma.user.findUnique({
      where: { id: entry.user_id },
    });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
console.log("step 1.2")
    // 2️⃣ Obtener tarifas del cliente
    const clientRate = await prisma.clientRates.findFirst({
      where: { clientId: entry.client_id },
    });
    if (!clientRate) {
      return new Response(JSON.stringify({ error: "Client rates not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
console.log("step 2")
    // 3️⃣ Seleccionar tarifa según tipo de usuario
    let rate: number;
    switch (user.type) {
      case "engineering":
        rate = Number(clientRate.engineeringRate);
        break;
      case "architecture":
        rate = Number(clientRate.architectureRate);
        break;
      case "senior_architecture":
        rate = Number(clientRate.seniorArchitectureRate);
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid user type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

    // 4️⃣ Calcular costo total
    const totalCost = rate * entry.hours_billed;

    // 5️⃣ Verificar fondos
    const client = await prisma.client.findUnique({
      where: { id: entry.client_id },
    });
    console.log("step 3")
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (Number(client.remainingFunds) < totalCost) {
      return new Response(JSON.stringify({ error: "Insufficient funds" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6️⃣ Transacción: crear work entry + actualizar cliente
    const [savedEntry, updatedClient] = await prisma.$transaction([
      prisma.workEntry.create({
        data: {
          billed_on: new Date(entry.billed_on),
          hours_billed: entry.hours_billed,
          hours_spent: entry.hours_spent,
          hourly_rate: rate,
          summary: entry.summary,
          rate_type: user.type,
          client_id: entry.client_id,
          user_id: entry.user_id,
        },
      }),
      prisma.client.update({
        where: { id: entry.client_id },
        data: {
          most_recent_work_entry: new Date(entry.billed_on),
          remainingFunds: Number(client.remainingFunds) - totalCost,
        },
      }),
    ]);

    return new Response(JSON.stringify(savedEntry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error)
    if (error instanceof Error && "errors" in error) {
      return new Response(JSON.stringify({ errors: (error as any).errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.error("Error creating work entry:", error);
    return new Response(JSON.stringify({ error: "Error creating work entry" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};