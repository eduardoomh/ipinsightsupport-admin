import { LoaderFunction } from "@remix-run/node";
import { getUserId } from "~/config/session.server";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";
import { prisma } from "~/config/prisma.server";
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
  const fieldsParam = url.searchParams.get("fields");
  const relationsParam = url.searchParams.get("relations");
  const userIdFilter = url.searchParams.get("user_id"); // URL 2 usa esto
  const statusFilter = url.searchParams.get("currentStatus");
  const lastNote = url.searchParams.get("last_note") === "true";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

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

  // 1. Configuración base de la query de paginación
  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: dynamicSelect,
  });

  // 2. Construir WHERE (Crítico para que la URL 2 funcione)
  const andConditions: any[] = [];

  if (userIdFilter && userIdFilter !== "undefined" && userIdFilter !== "null") {
    andConditions.push({
      OR: [
        { team_members: { some: { user_id: userIdFilter } } },
        { account_manager_id: userIdFilter },
      ],
    });
  }

  if (statusFilter) {
    const statuses = statusFilter.split(",").map((s) => s.trim().toUpperCase());
    andConditions.push(statuses.length === 1 
      ? { currentStatus: statuses[0] } 
      : { currentStatus: { in: statuses } }
    );
  }

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
      andConditions.push({ createdAt: { gte: fromDate, lte: toDate } });
    }
  }

  if (andConditions.length > 0) {
    queryOptions.where = { AND: andConditions };
  }

  // 3. Manejo de Includes (Relations)
  queryOptions.include = {};
  let hasIncludes = false;

  if (relationsParam) {
    hasIncludes = true;
    const relations = relationsParam.split(",").map((r) => r.trim());
    if (relations.includes("team_members")) {
      queryOptions.include.team_members = {
        select: {
          id: true,
          rate_type: true,
          user: { select: { id: true, name: true, email: true } },
        },
      };
    }
    if (relations.includes("account_manager")) {
      queryOptions.include.account_manager = { select: { id: true, name: true } };
    }
  }

  if (lastNote) {
    hasIncludes = true;
    queryOptions.include.client_status_history = {
      take: 1,
      orderBy: { changedAt: "desc" },
      select: { id: true, note: true, status: true, title: true, changedAt: true },
    };
  }

  // Si hay includes, no podemos usar select al mismo nivel en Prisma
  if (hasIncludes) {
    delete queryOptions.select;
  }

  // 4. Ejecución y Paginación
  const results = await prisma.client.findMany(queryOptions);

  // Generamos el pageInfo ANTES de cualquier mapeo que borre campos del cursor
  const { items: paginatedItems, pageInfo } = buildPageInfo(
    results,
    take,
    isBackward,
    cursor
  );

  // 5. Transformación final de datos
  const finalClients = paginatedItems.map((client: any) => {
    const transformed = { ...client };
    if (lastNote && client.client_status_history) {
      transformed.lastNote = client.client_status_history[0] || null;
      delete transformed.client_status_history;
    }
    return transformed;
  });

  return new Response(JSON.stringify({ clients: finalClients, pageInfo }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};