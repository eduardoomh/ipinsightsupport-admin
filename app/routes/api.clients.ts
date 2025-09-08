// app/routes/api/clients.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ClientSchema } from "~/utils/schemas/clientSchema";
import { prisma } from "~/config/prisma.server";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";
import { getUserId } from "~/config/session.server";
import { getDefaultRates } from "~/utils/general/getDefaultRates";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";

// GET /api/clients → obtener todos los clientes con relaciones clave
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
  const fieldsParam = url.searchParams.get("fields");
  const relationsParam = url.searchParams.get("relations");
  const userIdFilter = url.searchParams.get("user_id");
  const statusFilter = url.searchParams.get("currentStatus");
  const lastNote = url.searchParams.get("last_note") === "true";

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const defaultSelect = {
    id: true,
    company: true,
    timezone: true,
    createdAt: true,
    updatedAt: true,
    currentStatus: true,
  };

  const dynamicSelect = buildDynamicSelect(fieldsParam, defaultSelect);

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: dynamicSelect,
  });

  // --- Construir includes dinámicos ---
  let useInclude = false;
  queryOptions.include = {};

  if (relationsParam) {
    useInclude = true;
    const relations = relationsParam.split(",").map((r) => r.trim());

    if (relations.includes("team_members")) {
      queryOptions.include.team_members = {
        select: {
          id: true,
          rate_type: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      };
    }

    if (relations.includes("contacts")) {
      queryOptions.include.contacts = true;
    }

    if (relations.includes("account_manager")) {
      queryOptions.include.account_manager = {
        select: { id: true, name: true },
      };
    }
  }

  if (lastNote) {
    useInclude = true;
    queryOptions.include.client_status_history = {
      take: 1,
      orderBy: { changedAt: "desc" },
      select: {
        id: true,
        note: true,
        status: true,
        title: true,
        changedAt: true,
        changedBy: { select: { id: true, name: true } },
      },
    };
  }

  // ⚖️ Elegir entre include o select
  if (!useInclude) {
    queryOptions.select = dynamicSelect;
    delete queryOptions.include;
  } else {
    delete queryOptions.select;
  }

  // --- WHERE dinámico ---
  const andConditions: any[] = [];

  if (userIdFilter) {
    andConditions.push({
      OR: [
        { team_members: { some: { user_id: userIdFilter } } },
        { account_manager_id: userIdFilter },
      ],
    });
  }

  if (statusFilter) {
    const statuses = statusFilter.split(",").map((s) => s.trim().toUpperCase());
    if (statuses.length === 1) {
      andConditions.push({ currentStatus: statuses[0] });
    } else {
      andConditions.push({ currentStatus: { in: statuses } });
    }
  }

  if (andConditions.length > 0) {
    queryOptions.where = { AND: andConditions };
  }

  // --- Query ---
  const clients = await prisma.client.findMany(queryOptions);

  // --- Transformar lastNote ---
  const items = clients.map((client: any) => {
    if (lastNote) {
      const lastNoteObj = client.client_status_history?.[0] || null;
      const { client_status_history, ...rest } = client;
      return { ...rest, lastNote: lastNoteObj };
    }
    return client;
  });

  const { items: paginatedItems, pageInfo } = buildPageInfo(
    items,
    take,
    isBackward,
    cursor
  );

  return new Response(JSON.stringify({ clients: paginatedItems, pageInfo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// POST /api/clients → crear nuevo cliente
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const clientJson = formData.get("client") as string;

  if (!clientJson) {
    return new Response(JSON.stringify({ error: "No client data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const clientParsed = JSON.parse(clientJson);
    const client = ClientSchema.parse(clientParsed); // valida el input

    const savedClient = await prisma.$transaction(async (tx) => {
      // 1. Crear cliente
      const newClient = await tx.client.create({
        data: {
          company: client.company,
          currentStatus: client.currentStatus ?? "TRANSFER",
          timezone: getTimezoneLabel(client.timezone as any) as any ?? "CENTRAL",
          remainingFunds: client.remainingFunds ?? 0.0,
          most_recent_work_entry: client.most_recent_work_entry ?? null,
          most_recent_retainer_activated: client.most_recent_retainer_activated ?? null,
        },
      });

      // 2. Crear rates con los valores por defecto
      const defaultRates = getDefaultRates();

      await tx.clientRates.create({
        data: {
          clientId: newClient.id,
          engineeringRate: defaultRates.engineering,
          architectureRate: defaultRates.architecture,
          seniorArchitectureRate: defaultRates.senior_architecture,
        },
      });

      return newClient;
    });

    return new Response(JSON.stringify(savedClient), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating client:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error && "errors" in error
            ? (error as any).errors
            : "Error creating client",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};