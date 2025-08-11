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

  try {
    const parsedInput = JSON.parse(workEntryJson);

    // Validar con Zod
    const entry = WorkEntrySchema.parse(parsedInput);

    const savedEntry = await prisma.workEntry.create({
      data: {
        billed_on: new Date(entry.billed_on),
        hours_billed: entry.hours_billed,
        hours_spent: entry.hours_spent,
        hourly_rate: entry.hourly_rate,
        summary: entry.summary,
        rate_type: entry.rate_type,
        client_id: entry.client_id,
        user_id: entry.user_id,
      },
    });

    return new Response(JSON.stringify(savedEntry), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
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