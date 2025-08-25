// app/routes/api/clients.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ClientSchema } from "~/utils/schemas/clientSchema";
import { prisma } from "~/config/prisma.server";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildDynamicSelect } from "~/utils/fields/buildDynamicSelect";

// GET /api/clients → obtener todos los clientes con relaciones clave
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";
  const fieldsParam = url.searchParams.get("fields");
  const relationsParam = url.searchParams.get("relations");
  const userIdFilter = url.searchParams.get("user_id");

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const defaultSelect = {
    id: true,
    company: true,
    timezone: true,
    createdAt: true,
    updatedAt: true,
  };

  const dynamicSelect = buildDynamicSelect(fieldsParam, defaultSelect);

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: dynamicSelect,
  });

  // Include dinámico
  if (relationsParam) {
    const relations = relationsParam.split(",").map(r => r.trim());
    queryOptions.include = {};

    if (relations.includes("team_members")) {
      queryOptions.include.team_members = {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      };
    }

    if (relations.includes("contacts")) {
      queryOptions.include.contacts = true;
    }

    if (relations.includes("account_manager")) {
      queryOptions.include.account_manager = {
        select: {
          id: true,
          name: true,
          email: true,
          is_account_manager: true,
        },
      };
    }

    if (Object.keys(queryOptions.include).length > 0) {
      delete queryOptions.select;
    }
  }

  // Filtrado por user_id en team_members o como account_manager
  if (userIdFilter) {
    queryOptions.where = {
      ...(queryOptions.where || {}),
      OR: [
        {
          team_members: {
            some: {
              user_id: userIdFilter,
            },
          },
        },
        {
          account_manager_id: userIdFilter,
        },
      ],
    };
  }

  const clients = await prisma.client.findMany(queryOptions);

  const { items, pageInfo } = buildPageInfo(clients, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ clients: items, pageInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
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

    const savedClient = await prisma.client.create({
      data: {
        company: client.company,
        currentStatus: client.currentStatus ?? "ADHOC",
        timezone: client.timezone ?? "CENTRAL",
        remainingFunds: client.remainingFunds ?? 0.0,
        most_recent_work_entry: client.most_recent_work_entry ?? null,
        most_recent_retainer_activated: client.most_recent_retainer_activated ?? null,
      },
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